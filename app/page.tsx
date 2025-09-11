import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from './components/ui/card';

export default function Page() {
  return (
    <div className="mx-2 lg:mx-96 grid grid-rows-2 gap-4">
      <div className="col-span-12 lg:col-span-12">
        <h1 className="text-2xl">Hardyson Arthy anak Robin</h1>
        <h2 className="text-xl">Software Engineer</h2>
        <div className="flex gap-4 mt-4">
          <span className="m-0 p-0">
            <svg
              width="20px"
              height="20px"
              role="img"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e8e8e8"
            >
              <title>Location</title>
              <g id="SVGRepo_bgCarrier" strokeWidth="0" />
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                {' '}
                <path
                  d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
                  stroke="#e8e8e8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />{' '}
              </g>
            </svg>
          </span>
          <span>Miri, Sarawak, Malaysia</span>
        </div>

        <div className="text-justify mt-5">
          A technology-driven software engineer with 7+ years of experience of
          designing, researching and developing diverse software solutions for
          various purposes, which grants the benefits of insight from the
          multiple perspectives of different ends of software development.
          Professional fluency in .NET C#, JavaScript, and Dart, with interest
          in Rust and Golang, and possessing practical knowledge in SQL and
          NoSQL databases. A technology enthusiast, always recommending and
          experimenting with new technology trends and developments to enhance
          software quality and development experience.
        </div>

        <h1 className="text-xl mt-4 mb-2">Experience</h1>
        <div className="grid grid-cols-1 gap-1">
          <Card className="px-4 py-2 w-full">
            <CardTitle>
              <div className="">Software Engineer II</div>
            </CardTitle>
            <CardDescription>
              <div className="w-full flex justify-between">
                <div>MOVE Travel Sdn. Bhd.</div>
                <div>
                  <i>2022 - current</i>
                </div>
              </div>
            </CardDescription>
            <CardContent className="mt-4">
              <ul className="list-disc description-list">
                <li>
                  Designed and maintained (MongoDB, Express, TypeScript,
                  JavaScript) NodeJS backend microservices to serve frontend
                  platforms (website and mobile app) via RESTful APIs for
                  multiple lines of business.
                </li>
                <li>
                  Reducing risk of post-deployment bugs by integrating automated
                  unit and end-to-end testing in the Gitlab CI/CD pipeline.
                </li>
                <li>
                  Deploying, maintaining and optimizing the architecture of
                  services in Google Cloud Platform using Docker, Google
                  Kubernetes Engine, Google Cloud Run and Kong via IaC and IaaS
                  to ensure 99.9% uptime, while reducing -96% of total
                  infrastructure costs compared to the legacy code.
                </li>
                <li>
                  Tightly cooperating with multiple teams from various countries
                  and backgrounds to ensure alignment of achievements and high
                  quality product outcome.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="px-4 py-2  w-full">
            <CardTitle>
              <div className="">IT Executive (Programmer)</div>
            </CardTitle>
            <CardDescription>
              <div className="w-full flex justify-between">
                <div>Emart Holdings Sdn. Bhd.</div>
                <div>
                  <i>2017 - 2022</i>
                </div>
              </div>
            </CardDescription>
            <CardContent className="mt-4">
              <ul className="list-disc description-list">
                <li>
                  Developed 10+ in-house web applications using .NET (C#),
                  Microsoft IIS and MySQL/MariaDB, deployed to Microsoft Server.
                </li>
                <li>
                  Design, develop and maintain mobile applications for various
                  logistics and retail loyalty purposes using Android SDK,
                  Flutter and Firebase and integrations with in-house web
                  applications and third party products, including dedicated
                  hardware (PDAs) and IoT (Raspberry Pi)
                </li>
                <li>Mentor and guide junior programmers in the team</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <div>1</div>
    </div>
  );
}
