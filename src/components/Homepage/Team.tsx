type Props = {
  team: {
    name: string;
    bio: string;
    role: string;
    image: string;
  }[];
};

const Team = ({ team }: Props) => {
  return (
    <>
      <section className="max-w-6xl mx-auto p-4">
        <div className="container px-6 py-8 mx-auto flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-center capitalize lg:text-3xl">
            Our Team
          </h2>

          <div className="h-96 carousel carousel-vertical rounded-box sm:hidden mt-8 w-64">
            {team.slice(0, 4).map((teamMember, index) => (
              <div className="carousel-item h-full" key={index}>
                <img className="object-cover" src={teamMember?.image} />
              </div>
            ))}
          </div>

          <div className="hidden sm:grid gap-8 mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center">
            {team.slice(0, 4).map((teamMember, index) => (
              <div className="w-full max-w-xs text-center" key={index}>
                <img
                  className="object-cover object-center w-full h-48 mx-auto rounded-lg"
                  src={teamMember?.image || "/public/default-team.jpg"}
                  alt="avatar"
                  loading="lazy"
                />
                <div className="mt-2">
                  <h3 className="text-lg font-medium">
                    {teamMember?.name || ""}
                  </h3>
                  <span className="mt-1 font-medium">{teamMember?.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Team;
