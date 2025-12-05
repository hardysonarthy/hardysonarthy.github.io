import {
  Briefcase,
  Calendar,
  Cloud,
  Code2,
  Database,
  MapPin,
} from 'lucide-react';
import { Badge } from './components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card';

export default function Page() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Resume
          </h1>
          <div className="flex items-center gap-2 text-xl md:text-2xl text-muted-foreground">
            <Code2 className="h-6 w-6" />
            <span>Software Engineer</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-5 w-5" />
            <span>Kuala Lumpur, Malaysia</span>
          </div>
        </div>

        {/* Skills Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tech Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">
                TypeScript
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Node.js
              </Badge>
              <Badge variant="secondary" className="text-sm">
                MongoDB
              </Badge>
              <Badge variant="secondary" className="text-sm">
                .NET C#
              </Badge>
              <Badge variant="secondary" className="text-sm">
                React
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Docker
              </Badge>
              <Badge variant="secondary" className="text-sm">
                GCP
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Flutter
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Kubernetes
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Experience Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="h-6 w-6" />
          <h2 className="text-3xl font-bold">Experience</h2>
        </div>

        <div className="space-y-6">
          {/* Current Role */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl">
                    Software Engineer II
                  </CardTitle>
                  <CardDescription className="text-base">
                    MOVE Travel Sdn. Bhd.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="whitespace-nowrap">2022 - Present</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm md:text-base list-none">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">▹</span>
                  <span>
                    Designed and maintained{' '}
                    <strong>NodeJS backend microservices</strong> (MongoDB,
                    Express, TypeScript) serving frontend platforms via RESTful
                    APIs for multiple business lines
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">▹</span>
                  <span>
                    Reduced post-deployment bugs by integrating{' '}
                    <strong>automated testing</strong>
                    (unit & end-to-end) in GitLab CI/CD pipeline
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">▹</span>
                  <span>
                    Deployed and optimized services on{' '}
                    <strong>Google Cloud Platform</strong>
                    using Docker, GKE, Cloud Run and Kong, achieving{' '}
                    <strong>99.9% uptime</strong>
                    and <strong>96% cost reduction</strong>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">▹</span>
                  <span>
                    Collaborated with international teams across multiple
                    countries to ensure alignment and high-quality deliverables
                  </span>
                </li>
              </ul>

              <div className="pt-2 flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  <Database className="h-3 w-3 mr-1" />
                  MongoDB
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Code2 className="h-3 w-3 mr-1" />
                  TypeScript
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Cloud className="h-3 w-3 mr-1" />
                  GCP
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Docker
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Kubernetes
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Previous Role */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl">
                    IT Executive (Programmer)
                  </CardTitle>
                  <CardDescription className="text-base">
                    Emart Holdings Sdn. Bhd.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="whitespace-nowrap">2017 - 2022</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm md:text-base list-none">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">▹</span>
                  <span>
                    Developed <strong>10+ in-house web applications</strong>{' '}
                    using .NET (C#), IIS and MySQL/MariaDB on Microsoft Server
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">▹</span>
                  <span>
                    Built mobile applications for logistics and retail loyalty
                    using
                    <strong> Android SDK, Flutter and Firebase</strong>, with
                    integrations to third-party products and IoT devices (PDAs,
                    Raspberry Pi)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">▹</span>
                  <span>
                    Mentored and guided junior programmers on the development
                    team
                  </span>
                </li>
              </ul>

              <div className="pt-2 flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  .NET C#
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Flutter
                </Badge>
                <Badge variant="outline" className="text-xs">
                  MySQL
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Android SDK
                </Badge>
                <Badge variant="outline" className="text-xs">
                  IoT
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
