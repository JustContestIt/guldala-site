// Botanica: same system, inverted — dark ground, light text (brief §6)
export default function BotanicaLayout({ children }: LayoutProps<"/[lang]/botanica">) {
  return <div className="bg-night text-night-text">{children}</div>;
}
