'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

interface Image {
	src: string;
	alt?: string;
}

interface ZoomParallaxProps {
	/** Array of images to be displayed in the parallax effect max 7 images */
	images: Image[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
	const container = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	console.log('[ZoomParallax] Images received:', images);
	console.log('[ZoomParallax] Container ref:', container.current);

	// Start with visible scale (1.0) and zoom in on scroll
	const scale4 = useTransform(scrollYProgress, [0, 1], [1.0, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1.0, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1.0, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1.0, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1.0, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	// Position configurations for each image - adjusted for better visibility
	const positions = [
		{ top: '50%', left: '50%' }, // index 0 - center (main image)
		{ top: '25%', left: '15%' }, // index 1 - top left
		{ top: '15%', left: '75%' }, // index 2 - top right
		{ top: '50%', left: '50%' }, // index 3 - center (overlay)
		{ top: '75%', left: '20%' }, // index 4 - bottom left
		{ top: '75%', left: '80%' }, // index 5 - bottom right
		{ top: '35%', left: '85%' }, // index 6 - middle right
	];

	if (!images || images.length === 0) {
		return (
			<div className="flex items-center justify-center h-full w-full text-white">
				Keine Bilder verfügbar
			</div>
		);
	}

	return (
		<div ref={container} className="relative h-[300vh] w-full bg-transparent">
			<div className="sticky top-0 h-full w-full overflow-visible min-h-[600px] lg:min-h-[800px] relative">
				{images.slice(0, 7).map(({ src, alt }, index) => {
					const scale = scales[index % scales.length];
					const position = positions[index % positions.length];

					return (
						<motion.div
							key={`${src}-${index}`}
							style={{ 
								scale,
								position: 'absolute',
								top: position.top,
								left: position.left,
								transform: 'translate(-50%, -50%)',
								zIndex: index + 1,
							}}
							className="flex items-center justify-center pointer-events-none"
							initial={{ opacity: 1, scale: 1 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							<div className="relative w-[300px] h-[200px] md:w-[400px] md:h-[280px] lg:w-[500px] lg:h-[350px] rounded-xl overflow-hidden backdrop-blur-xl border-2 border-white/50 shadow-[0_0_40px_rgba(249,199,79,0.6),_0_4px_4px_rgba(0,_0,_0,_0.2),_0_0_0_2px_rgba(249,199,79,0.5),_0_0_12px_rgba(249,199,79,0.5),_0_25px_100px_rgba(47,_48,_55,_0.5)] hover:border-[#f9c74f] hover:shadow-[0_0_60px_rgba(249,199,79,0.9)] transition-all duration-300 bg-gradient-to-br from-[#51646f]/60 to-[#41535c]/60 pointer-events-auto">
								<img
									src={src || '/placeholder.svg'}
									alt={alt || `Parallax image ${index + 1}`}
									className="h-full w-full object-contain"
									loading="eager"
									style={{ display: 'block' }}
									onError={(e) => {
										console.error('[ZoomParallax] Image failed to load:', src);
										(e.target as HTMLImageElement).src = '/placeholder.svg';
									}}
									onLoad={() => {
										console.log('[ZoomParallax] Image loaded successfully:', src, 'Index:', index);
									}}
								/>
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}

