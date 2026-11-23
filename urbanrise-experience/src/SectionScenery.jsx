export default function SectionScenery({ desktop, mobile, chapterEffect }) {
  return (
    <picture className="followup-scenery" aria-hidden="true" data-chapter-scene={chapterEffect}>
      <source media="(max-width: 640px)" srcSet={mobile} />
      <img src={desktop} alt="" loading="lazy" decoding="async" />
    </picture>
  );
}
