export default function Container({
	className,
	children,
}: Readonly<{
	children: React.ReactNode;
	className?: string;
}>) {
	return (
		<div
			className={` ${className}    bg-gray-300/35 border  border-gray-200/50  shadow-xl shadow-white/50 rounded-lg `}>
			{children}
		</div>
	);
}
