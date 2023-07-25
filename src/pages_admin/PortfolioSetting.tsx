import {useEffect, useState} from "react";
import LoadingScreen from "../components/LoadingScreen.tsx";
import {Delete, Edit} from "@mui/icons-material";
import {Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import getPortfolio from "../repository/getPortfolio.ts";
import toastNotify from "../commons/Toast.tsx";
import {ToastContainer} from "react-toastify";
import {addDoc, collection, deleteDoc, doc} from "@firebase/firestore";
import {db} from "../db/Firebase.ts";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@firebase/storage";


const PortfolioSetting = () => {

    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

    const [title, setTitle] = useState("");
    const [image, setImage] = useState<File | null>();
    const [github, setGithub] = useState("");
    const [playstore, setPlaystore] = useState("");
    const [techStack, setTechStack] = useState<{ value: string }[] | null>([]);

    useEffect(() => {
        getPortfolio().then(value => setPortfolios(value));
        setIsLoadingPage(false);
    }, []);

    const uploadImageToFirebaseStorage = async () => {
        try {
            const storage = getStorage();
            const storageRef = ref(storage, `project/${image?.name}`);

            if (image) {
                return await uploadBytes(storageRef, image).then(async (snapshot) => {
                    return await getDownloadURL(snapshot.ref).then(value => value);
                });
            }

            toastNotify({type: "error", message: "Silahkan pilih gambar ulang."});
            return;
        } catch (e) {
            throw e;
        }


    }

    const handleSubmitAddPortfolio = async () => {

        if (title == "") {
            return toastNotify({type: "error", message: "Judul tidak boleh kosong"});
        } else if (image == null) {
            return toastNotify({type: "error", message: "Silahkan upload gambar dahulu"});
        } else if (github == "") {
            return toastNotify({type: "error", message: "Github tidak boleh kosong"});
        } else if (techStack == null) {
            return toastNotify({type: "error", message: "Teknologi tidak boleh kosong"});
        }

        try {
            const collectionRef = collection(db, "portfolio");
            const tech = techStack!.map(value => value.value);

            // upload to firebase storage
            const image_url = await uploadImageToFirebaseStorage();

            const portfolioData: Portfolio = {
                title: title,
                image_path: image_url,
                github: github,
                playstore: playstore,
                tech: tech
            };

            if (image_url != null) {
                await addDoc(collectionRef, portfolioData);
            }

            updatePortfoliosData(portfolioData);

            // clear value
            clearFormAddPortfolio();

            setIsFormDialogOpen(false);
            toastNotify({type: "success", message: "Berhasil tambah portfolio"});


        } catch (e) {
            toastNotify({type: "error", message: "Gagal tambah portfolio"});
            throw e;
        }
    }

    const updatePortfoliosData = (props: Portfolio) => {
        portfolios.push(props);
    }

    const deletePortfolioData = async (ID: string) => {
        try {
            const collectionRef = collection(db, "portfolio");
            await deleteDoc(doc(collectionRef, ID));
            const newPortfolios = portfolios.filter((value, _) => value.id != ID);
            setPortfolios(newPortfolios);
            toastNotify({type: "success", message: "Berhasil hapus portfolio."});
        } catch (e) {
            throw e;
        }
    }

    const clearFormAddPortfolio = () => {
        setTitle("");
        setImage(null);
        setGithub("");
        setPlaystore("");
        setTechStack(null);
    }

    if (isLoadingPage) {
        return LoadingScreen();
    }

    return (
        <div className="w-[90%] sm:w-[80%] h-screen pt-28  mx-5 flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <div>Pengaturan Portfolio</div>
                <button className="p-[0.5em] bg-blue-600 text-white" onClick={() => setIsFormDialogOpen(true)}>Tambah
                </button>
                <Dialog open={isFormDialogOpen} onClose={() => {
                    setIsFormDialogOpen(false);
                    clearFormAddPortfolio();
                }}>
                    <DialogTitle>Tambah Portfolio</DialogTitle>
                    <DialogContent>
                        <div className="flex flex-col justify-center items-center">
                            {
                                image ? <img
                                        src={image ? URL.createObjectURL(image) : ""}
                                        alt="Thumb"
                                        className="h-[125px] w-[256px] border rounded-md"
                                    /> :
                                    <div
                                        className="bg-gray-100 h-[125px] w-[256px] flex items-center justify-center rounded-md text-gray-500">No
                                        Selected File</div>
                            }
                            <div className="flex justify-center items-center gap-2">
                                <Button
                                    variant="contained"
                                    component="label"
                                    style={{marginBottom: "10px", marginTop: "10px"}}
                                >
                                    Upload File
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={event => setImage(event.target.files?.[0])}
                                        hidden
                                    />
                                </Button>
                                <div className={`block ${image ?? 'hidden'}`}>
                                    <button onClick={() => setImage(null)}>Hapus</button>
                                </div>
                            </div>
                            <div className="text-xs">Type file can attach: .png .jpg .jpeg</div>
                        </div>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            label="Judul"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={title}
                            onChange={event => setTitle(event.target.value)}
                        />

                        <TextField
                            autoFocus
                            margin="dense"
                            label="Github"
                            id="github"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={github}
                            onChange={event => setGithub(event.target.value)}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Playstore"
                            id="playstore"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={playstore}
                            onChange={event => setPlaystore(event.target.value)}
                        />
                        <Autocomplete
                            multiple
                            limitTags={2}
                            id="multiple-limit-tags"
                            options={techStackOption}
                            className="mt-3"
                            getOptionLabel={(option: {
                                value: string; title: string
                            }) => option.title}
                            renderInput={(params) => (
                                <TextField {...params} label="Tech Stack" placeholder="Favorites"/>
                            )}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            onChange={(_, value: { value: string }[]) => setTechStack(value)}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setIsFormDialogOpen(false);
                            clearFormAddPortfolio();
                        }}>BATAL</Button>
                        <Button onClick={handleSubmitAddPortfolio}>TAMBAH</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div className="flex flex-col gap-5">
                {portfolios.map(function (object, i) {
                    return <div className="flex justify-between p-3 border" key={i}>
                        <div>{object.title}</div>
                        <div className="flex gap-2 items-center justify-center">
                            <Edit></Edit>
                            <button onClick={() => deletePortfolioData(object.id!)}>
                                <Delete className="text-red-500"/>
                            </button>
                        </div>
                    </div>;
                })}
            </div>
            <ToastContainer/>
        </div>
    );
};

const techStackOption = [
    {
        title: "getx",
        value: "getx"
    },
    {
        title: "firebase",
        value: "firebase"
    },
    {
        title: "bloc",
        value: "bloc"
    },
    {
        title: "flutter",
        value: "flutter"
    },
    {
        title: "dart",
        value: "dart"
    },
    {
        title: "git",
        value: "git"
    },
    {
        title: "golang",
        value: "golang"
    },
    {
        title: "mysql",
        value: "mysql"
    },
    {
        title: "react",
        value: "react"
    },

]

export default PortfolioSetting;