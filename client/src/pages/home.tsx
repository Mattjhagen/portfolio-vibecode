import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Code, FileSearch, Palette, Rocket, Check, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/animated-background";
import { UploadZone } from "@/components/upload-zone";
import { PortfolioCard } from "@/components/portfolio-card";

export default function Home() {
  const [generatedPortfolio, setGeneratedPortfolio] = useState<any>(null);

  const { data: portfolios = [] } = useQuery({
    queryKey: ['/api/portfolios'],
  });

  const handleUploadComplete = (portfolioData: any) => {
    setGeneratedPortfolio(portfolioData);
    // Scroll to preview section
    const previewSection = document.getElementById('preview');
    if (previewSection) {
      previewSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Example portfolio images
  const exampleImages = [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-vibe-pink rounded-lg flex items-center justify-center">
              <Code className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold">VibeCode</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#generator" className="text-gray-300 hover:text-white transition-colors">Generator</a>
            <a href="#examples" className="text-gray-300 hover:text-white transition-colors">Examples</a>
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="http://blog.vibecodes.space/posts/Currentprojects.html" className="text-gray-300 hover:text-white transition-colors">Blog</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="generator" className="relative z-10 flex-grow flex flex-col items-center justify-center py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="w-24 h-24 bg-vibe-pink rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Code className="text-white" size={40} />
          </div>
          
          <h1 className="text-6xl font-bold mb-6">VibeCode</h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            VibeCode is an AI-powered platform that allows you to generate portfolio websites from your resume. Turn your experience into a professional portfolio, no code required.
          </p>
          
          <div className="max-w-2xl mx-auto mb-12">
            <UploadZone onUploadComplete={handleUploadComplete} />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="http://blog.vibecodes.space/posts/Currentprojects.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-vibe-pink hover:bg-vibe-pink/80 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 no-underline"
            >
              Read Our Blog
            </a>
            <Button 
              variant="outline" 
              className="border-vibe-green text-vibe-green hover:bg-vibe-green hover:text-black px-8 py-3 rounded-lg font-semibold transition-all"
              onClick={() => document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Examples
            </Button>
          </div>
        </div>
      </section>

      {/* Generated Portfolio Preview */}
      {generatedPortfolio && (
        <section id="preview" className="relative z-10 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Your Portfolio is Ready!</h2>
              <p className="text-xl text-gray-300">Your AI-generated portfolio is now live</p>
            </div>
            
            <Card className="glass-effect p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-vibe-pink rounded-full flex items-center justify-center">
                    <Code className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{generatedPortfolio.name}</h3>
                    <p className="text-gray-400">{generatedPortfolio.title}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-vibe-green">{generatedPortfolio.subdomain}.vibecodes.space</span>
                  <div className="flex space-x-2">
                    <Button 
                      className="bg-vibe-pink hover:bg-vibe-pink/80 text-white px-4 py-2 rounded-lg text-sm"
                      onClick={() => window.open(generatedPortfolio.url, '_blank')}
                    >
                      <ExternalLink className="mr-2" size={16} />
                      View Live
                    </Button>
                    <Link to={`/portfolio/${generatedPortfolio.subdomain}`}>
                      <Button className="bg-vibe-green hover:bg-vibe-green/80 text-white px-4 py-2 rounded-lg text-sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-300 mb-4">
                  Your portfolio has been generated and is now live! Share it with potential employers and clients.
                </p>
                <div className="flex justify-center">
                  <Button 
                    className="bg-vibe-pink hover:bg-vibe-pink/80 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPortfolio.url);
                      alert('Portfolio URL copied to clipboard!');
                    }}
                  >
                    Copy Portfolio URL
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Portfolio Examples Section */}
      <section id="examples" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Portfolio Examples</h2>
            <p className="text-xl text-gray-300">See what our AI can create for different professions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {portfolios.slice(0, 4).map((portfolio: any, index: number) => (
              <PortfolioCard
                key={portfolio.id}
                name={portfolio.name}
                title={portfolio.title}
                subdomain={portfolio.subdomain}
                theme={portfolio.theme}
                imageUrl={exampleImages[index % exampleImages.length]}
                onClick={() => window.open(portfolio.url, '_blank')}
              />
            ))}
            
            {/* Default examples if no portfolios exist */}
            {portfolios.length === 0 && (
              <>
                <PortfolioCard
                  name="Alex Johnson"
                  title="Software Developer"
                  subdomain="alex1234"
                  theme="technical"
                  imageUrl={exampleImages[0]}
                />
                <PortfolioCard
                  name="Sarah Chen"
                  title="UX Designer"
                  subdomain="sarah5678"
                  theme="creative"
                  imageUrl={exampleImages[1]}
                />
                <PortfolioCard
                  name="Mike Rodriguez"
                  title="Marketing Executive"
                  subdomain="mike9012"
                  theme="executive"
                  imageUrl={exampleImages[2]}
                />
                <PortfolioCard
                  name="Emma Wilson"
                  title="Data Scientist"
                  subdomain="emma3456"
                  theme="technical"
                  imageUrl={exampleImages[3]}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">AI-Powered Features</h2>
            <p className="text-xl text-gray-300">Advanced technology that makes portfolio creation effortless</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-effect p-8 text-center">
              <div className="w-16 h-16 bg-vibe-pink rounded-full flex items-center justify-center mx-auto mb-6">
                <FileSearch className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Resume Parsing</h3>
              <p className="text-gray-400 mb-6">Our AI extracts key information from any resume format, understanding context and importance automatically.</p>
              <div className="text-left space-y-2">
                <div className="flex items-center space-x-2">
                  <Check className="text-vibe-green" size={16} />
                  <span className="text-sm">Extracts skills & experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="text-vibe-green" size={16} />
                  <span className="text-sm">Identifies key achievements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="text-vibe-green" size={16} />
                  <span className="text-sm">Understands industry context</span>
                </div>
              </div>
            </Card>
            
            <Card className="glass-effect p-8 text-center">
              <div className="w-16 h-16 bg-vibe-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Personalized Design</h3>
              <p className="text-gray-400 mb-6">AI selects the perfect layout, colors, and typography based on your profession and personal style.</p>
              <div className="text-left space-y-2">
                <div className="flex items-center space-x-2">
                  <Check className="text-vibe-green" size={16} />
                  <span className="text-sm">Industry-specific layouts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="text-vibe-green" size={16} />
                  <span className="text-sm">Professional color schemes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="text-vibe-green" size={16} />
                  <span className="text-sm">Responsive design</span>
                </div>
              </div>
            </Card>
            
            <Card className="glass-effect p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-vibe-pink to-vibe-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Instant Deployment</h3>
              <p className="text-gray-400 mb-6">Your portfolio goes live instantly on our vibecodes.space subdomain with SSL and global CDN.</p>
              <div className="text-left space-y-2">
                <div className="flex items-center space-x-2">
                  <Check className="text-vibe-green" size={16} />
                  <span className="text-sm">Custom subdomain</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="text-vibe-green" size={16} />
                  <span className="text-sm">SSL certificate included</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="text-vibe-green" size={16} />
                  <span className="text-sm">Global CDN delivery</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://www.linkedin.com/in/mattjhagen?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" 
               target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-linkedin text-2xl"></i>
            </a>
            <a href="https://github.com/Packie" 
               target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-github text-2xl"></i>
            </a>
            <a href="https://www.reddit.com/u/PackieAI/s/hBxmSvCt9R" 
               target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-reddit text-2xl"></i>
            </a>
            <a href="https://discord.gg/wpde4HSS" 
               target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-discord text-2xl"></i>
            </a>
            <a href="https://coff.ee/vibecodes" 
               target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors">
              <i className="fas fa-coffee text-2xl"></i>
            </a>
            <a href="https://github.com/Mattjhagen/vibeCodeSpace" 
               target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-github text-2xl"></i>
            </a>
          </div>
          
          <div className="flex justify-center space-x-4 text-sm text-gray-400 mb-4">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
          
          <p className="text-gray-400 text-sm">&copy; 2025 PacMac Mobile LLC</p>
        </div>
      </footer>
    </div>
  );
}
