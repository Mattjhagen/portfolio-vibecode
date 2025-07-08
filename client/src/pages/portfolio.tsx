import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Mail, Phone, Globe, Github, Linkedin, Calendar, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedBackground } from "@/components/animated-background";
import { Separator } from "@/components/ui/separator";

export default function Portfolio() {
  const { subdomain } = useParams() as { subdomain: string };

  const { data: portfolio, isLoading, error } = useQuery({
    queryKey: [`/api/portfolio/${subdomain}`],
    enabled: !!subdomain,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibe-pink mx-auto mb-4"></div>
          <p className="text-xl">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Portfolio Not Found</h1>
          <p className="text-xl text-gray-400 mb-8">The portfolio you're looking for doesn't exist.</p>
          <Link to="/">
            <Button className="bg-vibe-pink hover:bg-vibe-pink/80 text-white px-8 py-3 rounded-full font-semibold">
              <ArrowLeft className="mr-2" size={20} />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2" size={20} />
              Back to Generator
            </Button>
          </Link>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-vibe-green">{portfolio.subdomain}.vibecodes.space</span>
            <Link to="/">
              <Button className="bg-vibe-green hover:bg-vibe-green/80 text-white px-4 py-2 rounded-lg text-sm mr-2">
                Create Your Own
              </Button>
            </Link>
            <Button 
              className="bg-vibe-pink hover:bg-vibe-pink/80 text-white px-4 py-2 rounded-lg text-sm"
              onClick={() => window.open(`https://${portfolio.subdomain}.vibecodes.space`, '_blank')}
            >
              <ExternalLink className="mr-2" size={16} />
              View Live
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Portfolio Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-vibe-pink rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-white">
                {portfolio.name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-4">{portfolio.name}</h1>
            <p className="text-2xl text-vibe-green mb-6">{portfolio.title}</p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {portfolio.about}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Experience Section */}
              {portfolio.experience && portfolio.experience.length > 0 && (
                <Card className="glass-effect p-8">
                  <h2 className="text-3xl font-bold mb-6 text-vibe-pink">Experience</h2>
                  <div className="space-y-6">
                    {portfolio.experience.map((exp: any, index: number) => (
                      <div key={index} className="border-l-2 border-vibe-pink pl-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold">{exp.position}</h3>
                            <p className="text-vibe-green font-medium">{exp.company}</p>
                          </div>
                          <div className="text-right text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{exp.startDate} - {exp.isCurrentJob ? 'Present' : exp.endDate}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Projects Section */}
              {portfolio.projects && portfolio.projects.length > 0 && (
                <Card className="glass-effect p-8">
                  <h2 className="text-3xl font-bold mb-6 text-vibe-green">Projects</h2>
                  <div className="space-y-6">
                    {portfolio.projects.map((project: any, index: number) => (
                      <div key={index} className="border-l-2 border-vibe-green pl-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold">{project.name}</h3>
                          <div className="flex space-x-2">
                            {project.url && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-vibe-green text-vibe-green"
                                onClick={() => window.open(project.url, '_blank')}
                              >
                                <ExternalLink size={14} />
                              </Button>
                            )}
                            {project.githubUrl && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-vibe-green text-vibe-green"
                                onClick={() => window.open(project.githubUrl, '_blank')}
                              >
                                <Github size={14} />
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-300 mb-3 leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech: string, techIndex: number) => (
                            <Badge key={techIndex} variant="secondary" className="bg-vibe-pink/20 text-vibe-pink">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Education Section */}
              {portfolio.education && portfolio.education.length > 0 && (
                <Card className="glass-effect p-8">
                  <h2 className="text-3xl font-bold mb-6 text-vibe-green">Education</h2>
                  <div className="space-y-6">
                    {portfolio.education.map((edu: any, index: number) => (
                      <div key={index} className="border-l-2 border-vibe-green pl-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold">{edu.degree}</h3>
                            <p className="text-vibe-green font-medium">{edu.field}</p>
                            <p className="text-gray-400">{edu.institution}</p>
                          </div>
                          <div className="text-right text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{edu.startDate} - {edu.endDate}</span>
                            </div>
                            {edu.gpa && (
                              <div className="mt-1">
                                <span>GPA: {edu.gpa}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact Info */}
              <Card className="glass-effect p-6">
                <h2 className="text-xl font-bold mb-6 text-vibe-pink">Contact</h2>
                <div className="space-y-4">
                  {portfolio.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="text-gray-400" size={18} />
                      <a href={`mailto:${portfolio.email}`} className="text-gray-300 hover:text-white transition-colors">
                        {portfolio.email}
                      </a>
                    </div>
                  )}
                  {portfolio.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="text-gray-400" size={18} />
                      <a href={`tel:${portfolio.phone}`} className="text-gray-300 hover:text-white transition-colors">
                        {portfolio.phone}
                      </a>
                    </div>
                  )}
                  {portfolio.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="text-gray-400" size={18} />
                      <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                        {portfolio.website}
                      </a>
                    </div>
                  )}
                  {portfolio.linkedin && (
                    <div className="flex items-center space-x-3">
                      <Linkedin className="text-gray-400" size={18} />
                      <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {portfolio.github && (
                    <div className="flex items-center space-x-3">
                      <Github className="text-gray-400" size={18} />
                      <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                        GitHub
                      </a>
                    </div>
                  )}
                </div>
              </Card>

              {/* Skills */}
              {portfolio.skills && portfolio.skills.length > 0 && (
                <Card className="glass-effect p-6">
                  <h2 className="text-xl font-bold mb-6 text-vibe-green">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-vibe-pink/20 text-vibe-pink">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Create Your Own CTA */}
              <Card className="glass-effect p-6 text-center">
                <h3 className="text-lg font-semibold mb-4">Create Your Own Portfolio</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Build your professional portfolio in minutes with our AI-powered generator.
                </p>
                <Link to="/">
                  <Button className="bg-vibe-pink hover:bg-vibe-pink/80 text-white px-6 py-2 rounded-full font-semibold w-full">
                    Get Started
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
