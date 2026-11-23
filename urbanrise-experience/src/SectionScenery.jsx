export default function SectionScenery({ desktop, mobile }) {
  return (
    <picture className="followup-scenery" aria-hidden="true">
      <source media="(max-width: 640px)" srcSet={mobile} />
      <img src={desktop} alt="" loading="lazy" decoding="async" />
    </picture>
  );
}
