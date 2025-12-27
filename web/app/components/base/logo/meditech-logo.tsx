'use client'
import type { FC } from 'react'
import classNames from '@/utils/classnames'
import useTheme from '@/hooks/use-theme'
import { basePath } from '@/utils/var'
export type LogoStyle = 'default' | 'monochromeWhite'

export const logoPathMap: Record<LogoStyle, string> = {
  default: '/logo/logo-meditech.png',
  monochromeWhite: '/logo/logo-meditech.png',
}

export type LogoSize = 'large' | 'medium' | 'small'

export const logoSizeMap: Record<LogoSize, string> = {
  // large: 'w-16 h-7',
  // medium: 'w-12 h-[22px]',
  // small: 'w-9 h-4',
  large: 'w-66 h-30',  // 128px x 48px
  medium: 'w-24 h-10',
  small: 'w-16 h-6',
}

type MeditechLogoProps = {
  style?: LogoStyle
  size?: LogoSize
  className?: string
}

const MeditechLogo: FC<MeditechLogoProps> = ({
  style = 'default',
  size = 'medium',
  className,
}) => {
  const { theme } = useTheme()
  const themedStyle = (theme === 'dark' && style === 'default') ? 'monochromeWhite' : style

  return (
    <img
      src={`${basePath}${logoPathMap[themedStyle]}`}
      className={classNames('block object-contain', logoSizeMap[size], className)}
      alt='Meditech logo'
    />
  )
}

export default MeditechLogo
