interface SubSectionProps {
  title: string;
  children: React.ReactNode;
}

const SubSection = ({ title, children }: SubSectionProps) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="text-gray-700">{children}</div>
  </div>
);

export default SubSection;
