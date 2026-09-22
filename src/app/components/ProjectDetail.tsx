import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';

export const ProjectDetail = () => {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Project not found</h1>
          <Link to="/work" className="text-neutral-500 hover:text-white underline">Back to Archive</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 min-h-screen text-white pt-32 px-6">
      <div className="container mx-auto">
        <Link to="/work" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Archive
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
             <h1 className="text-6xl md:text-9xl font-medium tracking-tighter leading-[0.9]">
               {project.title}
             </h1>
             <span className="font-mono text-sm text-neutral-400 mb-2">{project.category} — {project.year}</span>
          </div>

          <div className="aspect-[16/9] w-full bg-neutral-900 overflow-hidden rounded-sm">
             <motion.img 
               initial={{ scale: 1.1 }}
               animate={{ scale: 1 }}
               transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
               src={project.image} 
               alt={project.title}
               className="w-full h-full object-cover"
             />
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid md:grid-cols-[1fr_2fr] gap-24 mb-32">
           <div className="space-y-12">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 block mb-2">Client</span>
                <p className="text-xl font-light">{project.client}</p>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 block mb-2">Role</span>
                <p className="text-xl font-light">{project.role}</p>
              </div>
           </div>

           <div>
              <p className="text-2xl md:text-4xl font-light leading-relaxed text-neutral-300">
                {project.description}
              </p>
              
              <div className="mt-16 pt-16 border-t border-white/10">
                 <p className="text-lg text-neutral-500 leading-relaxed mb-8">
                   Additional project context would go here. We focused on delivering a solution that not only looked beautiful but performed exceptionally well. The design system was built to be scalable and modular.
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-900 aspect-square rounded-sm overflow-hidden">
                       <img src={project.image} className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-500" alt="Detail 1" />
                    </div>
                    <div className="bg-neutral-900 aspect-square rounded-sm overflow-hidden">
                       <img src={project.image} className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-500" alt="Detail 2" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
        
        {/* Next Project (Simple Link) */}
        <div className="border-t border-white/10 py-24 text-center">
           <Link to="/work" className="group inline-flex flex-col items-center gap-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Next Project</span>
              <span className="text-6xl md:text-8xl font-medium tracking-tighter group-hover:text-neutral-400 transition-colors">
                View Archive
              </span>
           </Link>
        </div>
      </div>
    </div>
  );
};
