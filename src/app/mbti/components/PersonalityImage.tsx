import React from 'react'
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

const personalityImages: Record<string, any> = {
  ENFJ: enfj,
  ENFP: enfp,
  ENTJ: entj,
  ENTP: entp,
  ESFJ: esfj,
  ESFP: esfp,
  ESTJ: estj,
  ESTP: estp,
  INFJ: infj,
  INFP: infp,
  INTJ: intj,
  INTP: intp,
  ISFJ: isfj,
  ISFP: isfp,
  ISTJ: istj,
  ISTP: istp,
}

interface PersonalityImageProps {
  type: string
  className?: string
  alt?: string
}

export function PersonalityImage({ type, className, alt }: PersonalityImageProps) {
  const upperType = type.toUpperCase()
  const imageSrc = personalityImages[upperType]

  if (!imageSrc) {
    return null
  }

  return (
    <div className={`relative ${className || 'w-32 h-32'}`}>
      <Image
        src={imageSrc}
        alt={alt || `${type} Personality`}
        fill
        className="object-contain"
      />
    </div>
  )
}
