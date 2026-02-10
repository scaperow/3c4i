'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Import all personality icons
import enfj from '../cover/enfj.svg'
import enfp from '../cover/enfp.svg'
import entj from '../cover/entj.svg'
import entp from '../cover/entp.svg'
import esfj from '../cover/esfj.svg'
import esfp from '../cover/esfp.svg'
import estj from '../cover/estj.svg'
import estp from '../cover/estp.svg'
import infj from '../cover/infj.svg'
import infp from '../cover/infp.svg'
import intj from '../cover/intj.svg'
import intp from '../cover/intp.svg'
import isfj from '../cover/isfj.svg'
import isfp from '../cover/isfp.svg'
import istj from '../cover/istj.svg'
import istp from '../cover/istp.svg'

const personalities = [
  { name: 'ENFJ', icon: enfj },
  { name: 'ENFP', icon: enfp },
  { name: 'ENTJ', icon: entj },
  { name: 'ENTP', icon: entp },
  { name: 'ESFJ', icon: esfj },
  { name: 'ESFP', icon: esfp },
  { name: 'ESTJ', icon: estj },
  { name: 'ESTP', icon: estp },
  { name: 'INFJ', icon: infj },
  { name: 'INFP', icon: infp },
  { name: 'INTJ', icon: intj },
  { name: 'INTP', icon: intp },
  { name: 'ISFJ', icon: isfj },
  { name: 'ISFP', icon: isfp },
  { name: 'ISTJ', icon: istj },
  { name: 'ISTP', icon: istp },
]

export function PersonalityMarquee({ className }: { className?: string }) {
  // Duplicate the list to ensure seamless scrolling
  const marqueeList = [...personalities, ...personalities]

  return (
    <div className={`w-full overflow-hidden ${className || ''}`}>
      <div className="relative flex">
        <motion.div
          className="flex gap-8 items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 30, // Adjust speed as needed
          }}
          style={{ width: 'fit-content' }}
        >
          {marqueeList.map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-default"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 relative transition-transform group-hover:scale-110">
                <Image
                  src={p.icon}
                  alt={p.name}
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
              <span className="text-xs font-mono text-white/40 group-hover:text-white/80 transition-colors">
                {p.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      {/* Gradient masks for smooth fade edges */}
      <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
    </div>
  )
}
