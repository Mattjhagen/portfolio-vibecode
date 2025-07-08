import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface PortfolioCardProps {
  name: string;
  title: string;
  subdomain: string;
  theme: string;
  imageUrl: string;
  onClick?: () => void;
}

export function PortfolioCard({ name, title, subdomain, theme, imageUrl, onClick }: PortfolioCardProps) {
  return (
    <Card 
      className="glass-effect p-6 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-vibe-pink/20"
      onClick={onClick}
    >
      <img 
        src={imageUrl}
        alt={`${name}'s portfolio`}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-sm text-gray-400 mb-4">{title}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-vibe-green">{subdomain}.vibecodes.space</span>
        <ExternalLink className="text-gray-400" size={16} />
      </div>
    </Card>
  );
}
