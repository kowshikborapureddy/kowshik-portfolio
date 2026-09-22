import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects'; // Import data

export const Work = () => {
  return (
    <div className="bg-neutral-950 min-h-screen text-white pt-32 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-24">
           <div>
             <Link to="/" className="text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-white transition-colors mb-8 block">
               ← Back to Home
             </Link>
             <h1 className="text-6xl md:text-9xl font-medium tracking-tighter leading-[0.9]">
               Archive <br />
               <span className="italic font-serif text-neutral-500">2021—24</span>
             </h1>
           </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16 pb-32">
          {projects.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/work/${project.slug}`}>
                <div className="relative overflow-hidden aspect-[3/4] mb-6 bg-neutral-900 rounded-sm">
                   <img 
                     src={project.image} 
                     alt={project.title}
                     className="object-cover w-full h-full opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                   />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                   
                   <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                   </div>
                </div>
                <div className="flex justify-between items-baseline border-t border-white/10 pt-4">
                   <div>
                     <h3 className="text-xl font-medium tracking-tight mb-1">{project.title}</h3>
                     <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">{project.category}</p>
                   </div>
                   <span className="text-xs font-mono text-neutral-600">{project.year}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
