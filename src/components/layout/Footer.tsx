import React from 'react';
import SocialIcon from '../ui/SocialIcon';

interface FooterProps {
  data?: {
    linkedin_url?: string;
    github_url?: string;
    instagram_url?: string;
    twitter_url?: string;
  };
}

const Footer: React.FC<FooterProps> = ({ data }) => {
  return (
    <footer className="w-full mt-12 xs:mt-16 lg:mt-24 bg-gradient-to-br from-blue-50/50 via-white to-white border-t border-zinc-200/20 flat">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 xs:px-12 py-10 xs:py-12 lg:py-16 max-w-7xl mx-auto gap-8">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
          <p className="font-space-grotesk text-xs uppercase tracking-widest text-zinc-500 opacity-70 hover:opacity-100 duration-500">
            © 2026 Dimas Febriyanto.
          </p>
          <nav aria-label="Site navigation" className="flex gap-6 font-space-grotesk text-xs uppercase tracking-widest">
            <a href="/blog" className="text-zinc-500 hover:text-blue-500 transition-all opacity-70 hover:opacity-100 duration-500">
              Blog
            </a>
            <a href="/#projects" className="text-zinc-500 hover:text-blue-500 transition-all opacity-70 hover:opacity-100 duration-500">
              Projects
            </a>
            <a href="/#contact" className="text-zinc-500 hover:text-blue-500 transition-all opacity-70 hover:opacity-100 duration-500">
              Contact
            </a>
          </nav>
        </div>
        <div className="flex gap-6 font-space-grotesk text-xs uppercase tracking-widest">
          {data?.github_url && (
            <a
              className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-500 transition-all opacity-70 hover:opacity-100 duration-500"
              href={data.github_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon platform="github" className="w-3 h-3" />
              GitHub
            </a>
          )}
          {data?.linkedin_url && (
            <a
              className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-500 transition-all opacity-70 hover:opacity-100 duration-500"
              href={data.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon platform="linkedin" className="w-3 h-3" />
              LinkedIn
            </a>
          )}
          {data?.instagram_url && (
            <a
              className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-500 transition-all opacity-70 hover:opacity-100 duration-500"
              href={data.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon platform="instagram" className="w-3 h-3" />
              Instagram
            </a>
          )}
          {data?.twitter_url && (
            <a
              className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-500 transition-all opacity-70 hover:opacity-100 duration-500"
              href={data.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon platform="twitter" className="w-3 h-3" />
              Twitter
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
