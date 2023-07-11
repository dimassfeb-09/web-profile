import CardPortopolio from "../components/CardPortopolio";

const Portopolio = () => {
  return (
    <div className="h-screen">
      <div className="pt-28 pb-28 p-5 gap-5 grid md:grid-cols-2 lg:grid-cols-3 overflow-y-auto  auto-rows-auto justify-center">
        <CardPortopolio
          title="eLibLend - Library Apps"
          imgPath="src/assets/img/project-1.png"
          github="https://github.com/dimassfeb-09/LibraryApp"
          playstore="https://play.google.com/store/apps/details?id=com.superapp.library_app"
        ></CardPortopolio>

        <CardPortopolio
          title="KBBI - Kamus Besar Bahasa Indonesia"
          imgPath="src/assets/img/project-2.png"
          github="https://github.com/dimassfeb-09?tab=repositories"
          playstore="https://play.google.com/store/apps/details?id=com.kbbisuperapp.com_kbbisuperapp"
        ></CardPortopolio>
      </div>
    </div>
  );
};

export default Portopolio;
