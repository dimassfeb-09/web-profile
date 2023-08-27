import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingScreen from "../components/LoadingScreen.tsx";
import { collection, doc, getDoc, Timestamp } from "@firebase/firestore";
import { db } from "../db/Firebase.ts";

type Pendidikan = {
  degree: string;
  school_name: string;
  experience?: string[];
  end_date: Timestamp;
  start_date: Timestamp;
};

const About = () => {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [detailPendidikan, setDetailPendidikan] = useState<Pendidikan[]>([]);

  const getPendidikan = async () => {
    try {
      const collectionRef = collection(db, "settings");
      const documentSnapshot = await getDoc(doc(collectionRef, "pendidikan"));
      const pendidikan: Pendidikan[] = documentSnapshot.get("pendidikan");
      setDetailPendidikan(pendidikan);
    } catch (e) {
      throw e;
    }
  };

  useEffect(() => {
    getPendidikan().then((v) => v);
    setTimeout(() => {
      setIsLoadingPage(false);
    }, 50);
  }, []);

  if (isLoadingPage) {
    return LoadingScreen();
  }

  return (
    <div className="dark:bg-darkColor h-screen dark:text-white pt-28 sm:pt-0">
      <div
        id="#about"
        className="text-md text-justify px-8 sm:pt-32 sm:px-16 sm:text-xl md:pt-36 md:px-20 lg"
      >
        <div className="text-4xl md:text-5xl xl:text-6xl font-semibold">
          Tentang
        </div>
        <div className="mt-9">
          <span>
            Halo! Nama saya Dimas Febriyanto, seorang mahasiswa dari Universitas
            di Indonesia, saat ini saya tinggal di Kota Bekasi. Saya memiliki
            kemampuan dan minat di dalam teknologi. Saya menyukai tantangan dan
            selalu mencari cara untuk meningkatkan kreatifitas saya. <br />
            <br />
            Saya menguasai berbagai alat dan teknologi seperti
          </span>
          <div className="flex gap-1 h-12">
            <img src="assets/svg/golang.svg" alt="Golang" />
            <img src="assets/svg/flutter.svg" alt="Flutter" />
            <img src="assets/svg/firebase.svg" alt="Firebase" />
            <img src="assets/svg/mysql.svg" alt="Mysql" />
          </div>

          <div className="mt-7">
            Jika Anda ingin melihat portopolio saya, silahkan klik halaman{" "}
            <b className="text-blue-600 hover:underline hover:cursor-pointer">
              <Link to="/portopolio">Portopolio</Link>
            </b>{" "}
            di sini.
          </div>
        </div>
      </div>
      <div
        id="#about"
        className="text-md text-justify px-8 mt-10 sm:px-16 sm:text-xl md:px-20 pb-10"
      >
        <div className="text-3xl md:text-4xl xl:text-5xl font-semibold">
          Pendidikan
        </div>
        <div className="flex flex-col gap-6 mt-7">
          <div className="flex flex-col">
            {detailPendidikan.map(function (object, _) {
              return (
                <div key={object.school_name}>
                  <div>
                    <div className="font-bold">
                      {object.degree}, {object.school_name}
                    </div>
                    <div className="text-sm">
                      {object.start_date.toDate().getFullYear()} -{" "}
                      {object.end_date.toDate().getFullYear()}
                    </div>
                  </div>
                  <div className="mt-5">
                    {object.experience ? (
                      <div className="mt-3">Pengalaman</div>
                    ) : (
                      <></>
                    )}
                    <ul>
                      {object.experience?.map((value, _) => (
                        <li key={value}>- {value}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
