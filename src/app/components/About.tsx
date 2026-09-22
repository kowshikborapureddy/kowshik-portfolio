import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';

export const About = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={containerRef} id="about" className="py-32 relative bg-neutral-950 overflow-hidden">
      {/* Background Grid - Technical Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-6">
        
        {/* Section Header - Consistent Style */}
        <div className="flex items-center gap-6 mb-24">
           <div className="flex items-baseline gap-3">
              <span className="font-serif italic text-lg text-white">02</span>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400">The Studio</span>
           </div>
           <div className="h-px w-32 bg-gradient-to-r from-white/30 to-transparent" />
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-20 items-start">
          
          {/* Text Content */}
          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-8xl font-medium tracking-tighter mb-12 leading-[0.9]"
            >
              We craft <br />
              <span className="italic font-serif text-neutral-500">silent</span> luxuries.
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-12 text-lg font-light text-neutral-400 leading-relaxed">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="space-y-6"
              >
                <p>
                  In a world screaming for attention, we choose the whisper. We build digital experiences that respect the user's intelligence and time.
                </p>
                <p>
                  Our philosophy is simple: perfection is achieved not when there is nothing left to add, but when there is nothing left to take away.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="space-y-6"
              >
                <p>
                  Our approach is rooted in the belief that utility and beauty are not separate entities, but rather the same force expressed differently.
                </p>
                <p className="text-white/80">
                  We collaborate with brands who understand that design is the silent ambassador of their values.
                </p>
              </motion.div>
            </div>

            {/* Stats & Trust */}
            <div className="mt-16 pt-16 border-t border-white/5">
               <div className="grid grid-cols-3 gap-8 mb-16">
                 <div className="space-y-2 border-r border-white/5">
                   <h4 className="text-4xl font-light text-white">05<span className="text-neutral-600 text-lg">+</span></h4>
                   <p className="text-xs uppercase tracking-widest text-neutral-500">Years Active</p>
                 </div>
                 <div className="space-y-2 border-r border-white/5">
                   <h4 className="text-4xl font-light text-white">42<span className="text-neutral-600 text-lg">+</span></h4>
                   <p className="text-xs uppercase tracking-widest text-neutral-500">Projects Delivered</p>
                 </div>
                 <div className="space-y-2">
                   <h4 className="text-4xl font-light text-white">12</h4>
                   <p className="text-xs uppercase tracking-widest text-neutral-500">Design Awards</p>
                 </div>
               </div>

               {/* Client List - Trust Factor */}
               <div>
                 <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 block mb-6">Trusted by industry leaders</span>
                 <div className="flex flex-wrap gap-x-12 gap-y-4 text-neutral-400 font-light text-lg">
                   {['Aesop', 'Leica', 'Herman Miller', 'Bang & Olufsen', 'Vitra', 'Polestar', 'Acne Studios'].map((client, i) => (
                     <motion.span 
                       key={client}
                       initial={{ opacity: 0 }}
                       whileInView={{ opacity: 1 }}
                       transition={{ delay: 0.5 + (i * 0.1) }}
                       className="hover:text-white transition-colors cursor-default"
                     >
                       {client}
                     </motion.span>
                   ))}
                 </div>
               </div>
            </div>
          </div>

          {/* Image Area */}
          <motion.div 
            style={{ opacity }}
            className="relative lg:mt-24"
          >
            <div className="relative z-10">
               <motion.div 
                 whileHover={{ scale: 0.98 }}
                 transition={{ duration: 0.5 }}
                 className="aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 ease-in-out bg-neutral-900"
               >
                 <img 
                   src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200" 
                   alt="Workspace" 
                   className="w-full h-full object-cover opacity-80" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
               </motion.div>
               
               {/* Decorative Ring */}
               <div className="absolute -bottom-12 -left-12 w-48 h-48 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-sm hidden md:flex" style={{ animation: 'spin 15s linear infinite' }}>
                 <style dangerouslySetInnerHTML={{__html: `
                   @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                 `}} />
                 <svg className="w-full h-full p-2" viewBox="0 0 100 100">
                   <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                   <text className="fill-neutral-500 text-[10px] uppercase tracking-widest font-mono">
                     <textPath href="#circlePath">
                       • Digital Design • Strategy • Development
                     </textPath>
                   </text>
                 </svg>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
