import {Link} from "react-router-dom";

const About = () => {
    return (
        <div>
            <div
                id="#about"
                className="text-md text-justify pt-28 px-8 sm:pt-32 sm:px-16 sm:text-xl md:pt-36 md:px-20 lg">
                <div className="text-4xl md:text-5xl xl:text-6xl font-semibold">Tentang</div>
                <div className="mt-9">
                    <span>
                    Halo! Nama saya Dimas Febriyanto, seorang mahasiswa dari Universitas di Indonesia, saat ini saya
                    tinggal di Kota Bekasi.
                    Saya memiliki kemampuan dan minat di dalam teknologi. Saya menyukai tantangan dan selalu mencari
                    cara untuk meningkatkan kreatifitas saya. <br/><br/>
                    Saya menguasai berbagai alat dan teknologi seperti
                    </span>
                    <div className="flex gap-1 h-12">
                        <img src="/src/assets/svg/golang.svg" alt="Golang"/>
                        <img src="/src/assets/svg/flutter.svg" alt="Flutter"/>
                        <img src="/src/assets/svg/firebase.svg" alt="Firebase"/>
                        <img src="/src/assets/svg/mysql.svg" alt="Mysql"/>
                    </div>

                    <div className="mt-7">
                        Jika Anda ingin melihat portopolio saya, silahkan klik halaman <b
                        className="text-blue-600 hover:underline hover:cursor-pointer"><Link
                        to="/portopolio">Portopolio</Link></b> di sini.
                    </div>

                </div>
            </div>
            <div id="#about"
                 className="text-md text-justify px-8 mt-10 sm:text-xl md:px-20 mb-10">
                <div className="text-3xl md:text-4xl xl:text-5xl font-semibold">Pendidikan</div>
                <div className="flex flex-col gap-6 mt-7">
                    <div className="flex flex-col">
                        <div className="font-bold flex justify-between">
                            <div>S1 Teknik Informatika, Universitas Gunadarma</div>
                            <div>2022 - Saat Ini</div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold flex justify-between">
                            <div>SMA PGRI 1 Kota Bekasi</div>
                            <div>2019 - 2022</div>
                        </div>
                        <div>
                            <div className="mt-3">Pengalaman</div>
                            <ul>
                                <li>- Juara Kelas 2 lomba film pendek diadakan oleh OSIS SMA PGRI 1 KOTA BEKASI.
                                </li>
                                <li>- Partisipasi Lomba Paskibra di SMK Taruna Bangsa
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
