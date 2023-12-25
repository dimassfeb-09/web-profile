import CardExperiences from "../components/CardExperiences";

export default function Experiences() {
  const description = [
    "- Handled more than 100 practitioners in solving coding problems, ensuring understanding of concepts and effective problem solving.",
    "- Provide technical support to practitioners regarding the use of application software, helping them overcome obstacles that may arise.",
    "- Provide tips and tricks to improve efficiency and skills during training.",
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-20 text-justify">
        Experiences & Education
      </h1>
      <CardExperiences
        title="Lembaga Pengembangan Komputerisasi (LepKom) - Universitas Gunadarma"
        started="Sept 2023"
        ended="Now"
        position="Laboratory Assistant"
        description={description}
      />
      <CardExperiences
        title="Informatics Student at Gunadarma University"
        started="2022"
        ended="2026"
        position="S1, Informatics"
        description={null}
      />
      <CardExperiences
        title="Senior High School PGRI 1 Kota Bekasi"
        started="2019"
        ended="2022"
        position="Science"
        description={null}
      />
    </div>
  );
}
