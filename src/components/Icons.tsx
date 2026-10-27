import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function Scales(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M16 7v18" />
      <path d="M10 25h12" />
      <path d="M5.5 11.5h21" />
      <path d="M5.5 11.5 2 19h7l-3.5-7.5Z" />
      <path d="M26.5 11.5 23 19h7l-3.5-7.5Z" />
      <circle cx="16" cy="5.4" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M3 10h13" />
      <path d="m11 4 6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true" {...props}>
      <path d="M5 15 15 5" />
      <path d="M6 5h9v9" />
    </svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M17 10H4" />
      <path d="m9 4-6 6 6 6" />
    </svg>
  );
}

export function ArrowUp(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true" {...props}>
      <path d="M10 17V4" />
      <path d="m4 9 6-6 6 6" />
    </svg>
  );
}

export function Star(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true" {...props}>
      <path d="M10 1.6l2.47 5.3 5.53.72-4.08 3.86 1.05 5.62L10 14.36 5.03 17.1l1.05-5.62L2 7.62l5.53-.72L10 1.6Z" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M4 4l12 12M16 4L4 16" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true" {...props}>
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function Phone(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M5.2 2.8 7 6.2 4.9 7.9c.9 2.3 2.9 4.3 5.2 5.2l1.7-2.1 3.4 1.8-.4 3c-.2.9-1 1.5-1.9 1.4C7.1 16.4 3.6 12.9 2.7 6.3c-.1-.9.4-1.7 1.3-2.2l1.2-1.3Z" />
    </svg>
  );
}

export function Chat(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M17 9.5c0 3.6-3.1 6.5-7 6.5-.9 0-1.8-.2-2.6-.5L3 17l1.2-3.2C3.4 12.6 3 11.1 3 9.5 3 5.9 6.1 3 10 3s7 2.9 7 6.5Z" />
    </svg>
  );
}

export function Send(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M17.5 2.5 2.5 9.2l5.6 2.3 2.2 5.6 7.2-14.6Z" />
      <path d="m8.1 11.5 3.3 3.3" />
    </svg>
  );
}

export function MapPin(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M16 8.3c0 4.2-6 8.7-6 8.7s-6-4.5-6-8.7A6 6 0 0 1 16 8.3Z" />
      <circle cx="10" cy="8.3" r="2.2" />
    </svg>
  );
}

export function Clock(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="7.3" />
      <path d="M10 6v4.3l2.8 1.7" />
    </svg>
  );
}
