export default function SectionScenery({
  desktop, mobile, compactDesktop, compactMobile, chapterEffect,
  className = 'followup-scenery',
}) {
  return (
    <picture className={className} aria-hidden="true" data-chapter-scene={chapterEffect}>
      <source media="(max-width: 640px)" srcSet={compactMobile ? `${compactMobile} 540w, ${mobile} 720w` : mobile} />
      <img src={desktop} srcSet={compactDesktop ? `${compactDesktop} 1440w, ${desktop} 1920w` : undefined}
        alt="" loading="lazy" decoding="async" />
    </picture>
  );
}
