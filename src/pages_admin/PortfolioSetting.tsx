import {useEffect, useState} from "react";
import LoadingScreen from "../components/LoadingScreen.tsx";
import {Delete, Edit} from "@mui/icons-material";
import {Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,} from "@mui/material";
import {getDownloadURL, getStorage, ref, uploadBytes,} from "@firebase/storage";
import {ToastContainer} from "react-toastify";
import {addDoc, collection} from "@firebase/firestore";

import getPortfolio from "../repository/getPortfolio.ts";
import toastNotify from "../commons/Toast.tsx";
import {db} from "../db/Firebase.ts";

const PortfolioSetting = () => {
    const [portfolioDatasTable, setPortfolioDatasTable] = useState<Portfolio[]>(
        []
    );
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

    const [title, setTitle] = useState("");
    const [platform, setPlatform] = useState("");
    const [image, setImage] = useState<File | null>();
    const [github, setGithub] = useState("");
    const [playStore, setPlaystore] = useState("");
    const [demoLive, setDemoLive] = useState("");
    const [techStack, setTechStack] = useState<{ value: string }[] | null>([]);

    useEffect(() => {
        getPortfolio().then((value) => setPortfolioDatasTable(value));
        setIsLoadingPage(false);
    }, []);

    const uploadImageToFirebaseStorage = async () => {
        try {
            const storage = getStorage();
            const storageRef = ref(storage, `project/${image?.name}`);

            if (image) {
                return await uploadBytes(storageRef, image).then(async (snapshot) => {
                    return await getDownloadURL(snapshot.ref).then((value) => value);
                });
            }

            toastNotify({type: "error", message: "Silahkan pilih gambar ulang."});
            return;
        } catch (e) {
            throw e;
        }
    };

    const clearFormAddPortfolio = () => {
        setTitle("");
        setPlatform("");
        setImage(null);
        setGithub("");
        setPlaystore("");
        setDemoLive("");
        setTechStack(null);
    };

    const validationFormInput = async () => {
        try {
            if (title == "") {
                throw new Error("Judul tidak boleh kosong");
            } else if (image == null) {
                throw new Error("Silahkan upload gambar dahulu");
            } else if (github == "") {
                throw new Error("Github tidak boleh kosong");
            } else if (techStack == null) {
                throw new Error("Teknologi tidak boleh kosong");
            }
        } catch (e: any) {
            throw toastNotify({message: e.message, type: "error"});
        }
    };

    const handleSubmitAddPortfolio = async () => {
        try {
            await validationFormInput();

            const collectionRef = collection(db, "portfolio");
            const tech = techStack!.map((value) => value.value);

            // upload to firebase storage and getting image url
            const imageURL = await uploadImageToFirebaseStorage();

            const portfolioData: Portfolio = {
                title: title,
                image_path: imageURL,
                github: github,
                platform: platform,
                playstore: playStore,
                tech: tech,
                demo_live: demoLive,
            };

            if (imageURL != null) {
                // Add field to new document
                await addDoc(collectionRef, portfolioData);
            }

            // Added to table portfolio
            portfolioDatasTable.push(portfolioData);

            // Clear value after added
            clearFormAddPortfolio();

            setIsFormDialogOpen(false);
            toastNotify({type: "success", message: "Berhasil tambah portfolio"});
        } catch (e) {
            throw e;
        }
    };

    if (isLoadingPage) {
        return LoadingScreen();
    }

    return (
        <div className="w-[90%] sm:w-[80%] h-screen pt-28  mx-5 flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <div>Pengaturan Portfolio</div>
                <button
                    className="p-[0.5em] bg-blue-600 text-white"
                    onClick={() => setIsFormDialogOpen(true)}
                >
                    Tambah
                </button>
                <Dialog
                    open={isFormDialogOpen}
                    onClose={() => {
                        setIsFormDialogOpen(false);
                        clearFormAddPortfolio();
                    }}
                >
                    <DialogTitle>Tambah Portfolio</DialogTitle>
                    <DialogContent>
                        <div className="flex flex-col justify-center items-center">
                            {image ? (
                                <img
                                    src={image ? URL.createObjectURL(image) : ""}
                                    alt="Thumb"
                                    className="h-[125px] w-[256px] border rounded-md"
                                />
                            ) : (
                                <div
                                    className="bg-gray-100 h-[125px] w-[256px] flex items-center justify-center rounded-md text-gray-500">
                                    No Selected File
                                </div>
                            )}
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
                                        onChange={(e) => setImage(e.target.files?.[0])}
                                        hidden
                                    />
                                </Button>
                                <div className={`block ${image ?? "hidden"}`}>
                                    <button onClick={() => setImage(null)}>Hapus</button>
                                </div>
                            </div>
                            <div className="text-xs">
                                Type file can attach: .png .jpg .jpeg
                            </div>
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
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            label="Judul"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
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
                            onChange={(e) => setGithub(e.target.value)}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Playstore"
                            id="playstore"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={playStore}
                            onChange={(e) => setPlaystore(e.target.value)}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Demo Live"
                            id="demolive"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={demoLive}
                            onChange={(e) => setDemoLive(e.target.value)}
                        />
                        <Autocomplete
                            multiple
                            limitTags={2}
                            id="multiple-limit-tags"
                            options={techStackOption}
                            className="mt-3"
                            getOptionLabel={(option: { value: string; title: string }) =>
                                option.title
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Tech Stack"
                                    placeholder="Favorites"
                                />
                            )}
                            isOptionEqualToValue={(option, value) =>
                                option.value === value.value
                            }
                            onChange={(_, value: { value: string }[]) => setTechStack(value)}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setIsFormDialogOpen(false);
                                clearFormAddPortfolio();
                            }}
                        >
                            BATAL
                        </Button>
                        <Button onClick={handleSubmitAddPortfolio}>TAMBAH</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div className="flex flex-col gap-5">
                {portfolioDatasTable.map(function (portfolio, _) {
                    return (
                        <div
                            className="flex justify-between p-3 border"
                            key={portfolio.title}
                        >
                            <div>{portfolio.title}</div>
                            <div className="flex gap-2 items-center justify-center">
                                <Edit></Edit>
                                <button>
                                    <Delete className="text-red-500"/>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <ToastContainer/>
        </div>
    );
};

const techStackOption = [
    {
        title: "getx",
        value: "getx",
    },
    {
        title: "firebase",
        value: "firebase",
    },
    {
        title: "bloc",
        value: "bloc",
    },
    {
        title: "flutter",
        value: "flutter",
    },
    {
        title: "dart",
        value: "dart",
    },
    {
        title: "git",
        value: "git",
    },
    {
        title: "golang",
        value: "golang",
    },
    {
        title: "mysql",
        value: "mysql",
    },
    {
        title: "react",
        value: "react",
    },
    {
        title: "postgres",
        value: "postgres",
    },
    {
        title: "typescript",
        value: "typescript",
    },
    {
        title: "supabase",
        value: "supabase",
    },
];

export default PortfolioSetting;
