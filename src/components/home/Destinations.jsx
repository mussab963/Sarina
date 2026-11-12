import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Sparkles } from "lucide-react";

const destinations = [
  {
    id: "damascus",
    name: "دمشق",
    description: "مدينة الياسمين",
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/6/68/Syria%2C_Damascus%2C_The_Umayyad_Mosque.jpg",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Syria,_Damascus,_The_Umayyad_Mosque.jpg",
    ],
  },
  {
    id: "aleppo",
    name: "حلب",
    description: "عاصمة الشهباء",
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/5/59/Citadel_of_Aleppo%2C_Gates%2C_Aleppo%2C_Syria.jpg",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Citadel_of_Aleppo,_Gates,_Aleppo,_Syria.jpg",
    ],
  },
  {
    id: "latakia",
    name: "اللاذقية",
    description: "نسمة من البحر",
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d3/Beach_Latakia_1.jpg",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Beach_Latakia_1.jpg",
    ],
  },
  {
    id: "homs",
    name: "حمص",
    description: "قلب سوريا",
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/e/eb/Homs_Khalid_Ibn_al-Walid_Mosque_3074.jpg",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Homs_Khalid_Ibn_al-Walid_Mosque_3074.jpg",
    ],
  },
];

function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function DestinationCard({ city, onSelect }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photo = city.photos[photoIndex];

  return (
    <button
      type="button"
      onClick={() => onSelect(city.id)}
      className="
        group relative block w-full
        aspect-[0.87] overflow-hidden
        rounded-[19px] text-right
        shadow-[0_15px_55px_rgba(19,54,72,0.065)]
        transition-all duration-300
        hover:-translate-y-[7px]
        hover:shadow-[0_22px_60px_rgba(19,54,72,0.11)]
        max-[900px]:aspect-[1.35]
        max-[650px]:aspect-[0.98]
        max-[650px]:rounded-2xl
      "
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#23586a] to-[#769f99]">
        {photo && (
          <img
            src={photo}
            alt={`صورة من ${city.name} في سوريا`}
            loading="lazy"
            decoding="async"
            onError={() => setPhotoIndex((i) => i + 1)}
            className="
              h-full w-full object-cover
              transition-transform duration-500
              group-hover:scale-[1.09]
            "
          />
        )}
      </div>

      <div
        className="
          absolute inset-0 flex items-end
          justify-between p-5 text-white
          bg-[linear-gradient(0deg,rgba(7,35,48,0.87)_0%,rgba(7,35,48,0.25)_59%,rgba(7,35,48,0.03)_86%)]
          max-[650px]:p-[13px]
        "
      >
        <span className="flex flex-col">
          <strong className="text-[21px] font-extrabold max-[650px]:text-lg">
            {city.name}
          </strong>

          <small className="text-[11px] opacity-80 max-[650px]:text-[9px]">
            {city.description}
          </small>
        </span>

        <span
          className="
            grid h-[39px] w-[39px]
            shrink-0 place-items-center
            rounded-full border border-white/40
            bg-white/20
            transition-all duration-200
            group-hover:-translate-x-1
            group-hover:bg-[#0aa99b]
            max-[650px]:h-[30px]
            max-[650px]:w-[30px]
          "
        >
          <ArrowLeft size={18} />
        </span>
      </div>
    </button>
  );
}

function Destinations() {
  const navigate = useNavigate();

  function handleSelect(destination) {
    const origin = destination === "aleppo" ? "homs" : "aleppo";

    const params = new URLSearchParams({
      origin,
      destination,
      date: getTomorrow(),
      people: "1",
    });

    navigate(`/results?${params.toString()}`);
  }

  return (
    <section className="py-[86px] max-[650px]:py-[58px]">
      <div
        className="
          mx-auto max-w-[1216px]
          w-[calc(100%-68px)]
          max-[1150px]:w-[calc(100%-48px)]
          max-[650px]:w-[calc(100%-34px)]
        "
      >
        <div
          className="
            mb-7 flex items-end
            justify-between gap-[25px]
            max-[650px]:flex-col
            max-[650px]:items-start
            max-[650px]:gap-[10px]
          "
        >
          <div>
            <span
              className="
                inline-flex items-center gap-2
                rounded-full bg-[#e6f8f3]
                px-[14px] py-[5px]
                text-[11px] font-black text-[#078e87]
                dark:bg-[#174b49]
                dark:text-[#68dfcc]
              "
            >
              <Sparkles size={13} />
              اكتشف سوريا
            </span>

            <h2
              className="
                mt-3 mb-[6px]
                text-[clamp(25px,3vw,36px)]
                font-extrabold
                tracking-[-0.6px]
                text-[#112f41] dark:text-white
                max-[650px]:text-[28px]
              "
            >
              على وين حابب <span className="text-[#0aa99b]">تسافر؟</span>
            </h2>

            <p className="text-xs text-[#718493] dark:text-[#9eb3be]">
              وجهات مختلفة، ونفس الشعور الحلو لما تكون بالطريق.
            </p>
          </div>

          <Link
            to="/results"
            className="
              group flex items-center gap-[10px]
              whitespace-nowrap text-xs font-black
              text-[#078e87]
              dark:text-[#68dfcc]
            "
          >
            استكشف الرحلات
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
          </Link>
        </div>

        <div
          className="
            grid grid-cols-4 gap-[18px]
            max-[900px]:grid-cols-2
            max-[650px]:gap-[11px]
          "
        >
          {destinations.map((city) => (
            <DestinationCard
              key={city.id}
              city={city}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Destinations;
