const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Detailed evaluation of the 74 unique visual assets in public/images and public/images 2
const EVALUATIONS = {
  '3d-render-robot-holding-solar-panel-grassy-glboe_1048-10930': {
    subject: '3D cartoon robot holding a small solar panel on grassy mini-globe',
    use: 'Reject / Do not use',
    quality: 'Unsuitable style; whimsical/childish 3D render inconsistent with B2B engineering aesthetic.'
  },
  '3d-rendered-solar-panel-isolated-white-background_181624-57019': {
    subject: 'Single PV module on mounting rack with white/neutral background',
    use: 'Product illustration / Technical diagram',
    quality: 'Clean 3D render, no text, no watermarks, no identifiable faces.'
  },
  'aerial-view-of-a-solar-farm-in-the-countryside': {
    subject: 'Aerial landscape view of a utility-scale solar farm across rural hills',
    use: 'About page banner / Category story background',
    quality: 'Natural documentary photo, crisp resolution, no logos, no faces, no watermarks.'
  },
  'aerial-view-private-house-with-solar-panels-roof_181624-14677': {
    subject: 'High-angle aerial shot of a residential pitched roof with monocrystalline solar panels',
    use: 'Use cases / Installation showcase',
    quality: 'High quality architectural photo, clear roof context, no logos, no faces.'
  },
  'alternative-energy-ecological-concept_1157-35707': {
    subject: 'Solar panels row in green field with sunrise horizon',
    use: 'General renewable background / closing banner',
    quality: 'Vibrant colors, good depth of field, no logos, no faces.'
  },
  'beautiful-alternative-energy-plant-with-solar-panels_23-2149192692': {
    subject: 'Expansive commercial solar power plant with neatly aligned photovoltaic arrays',
    use: 'About page / Commercial scale proof',
    quality: 'Crisp commercial photo, rich contrast, no watermarks, no logos, no faces.'
  },
  'concept-clean-energy-power-nature_34152-1265': {
    subject: 'Photovoltaic panels with lush foliage and sun flare',
    use: 'Sustainability context / environmental impact',
    quality: 'Photographic quality, slight flare, no text, no logos.'
  },
  'concept-clean-energy-power-nature-solar-panel-wind-turbine-hill-with-sunshine_34152-1371': {
    subject: 'Solar panels and wind turbine on rolling hill in sunset light',
    use: 'Clean energy concept banner',
    quality: 'High contrast landscape, clean, no watermarks.'
  },
  'ecology-green-energy-realistic-concept-with-wind-turbines-solar-panels-background-with-cityscape-silhouette-vector-illustration_1284-84909': {
    subject: 'Vector graphic of city skyline with wind turbines and solar panels',
    use: 'Reject / Do not use',
    quality: 'Vector clip-art styling; clashes with photographic design language.'
  },
  'foreman-businessman-solar-energy-station_1157-35710': {
    subject: 'Business executive and technical site foreman shaking hands at solar farm',
    use: 'B2B commercial partnership / procurement context',
    quality: 'Identifiable faces; do NOT use as fake testimonial/endorsement per PRD rule.'
  },
  'man-worker-firld-by-solar-panels_1303-15551': {
    subject: 'Solar technician in yellow hard hat inspecting module wiring in field',
    use: 'Technical inspection / field service context',
    quality: 'Identifiable face; do NOT use as testimonial. Useful for general service context.'
  },
  'man-worker-firld-by-solar-panels_1303-15565': {
    subject: 'Technician kneeling by solar array conducting electrical multimeter test',
    use: 'Quality testing & validation feature card',
    quality: 'Clear hands-on engineering context; recognizable face.'
  },
  'man-worker-firld-by-solar-panels_1303-15589': {
    subject: 'Technician walking between rows of solar panels with clipboard',
    use: 'EPC project management / site audit',
    quality: 'Wide framing, professional apparel, good lighting.'
  },
  'man-worker-firld-by-solar-panels_1303-15600': {
    subject: 'Technician checking junction box and cabling behind solar panel rack',
    use: 'B2B engineering support / wiring detail',
    quality: 'High detail on mounting aluminum rails and conduits.'
  },
  'medium-shot-engineer-drawing-plan-outdoors_23-2149352263': {
    subject: 'Engineer in white helmet and safety vest reviewing technical blueprinted schematic outdoors',
    use: 'Ordering Steps — Step 1 (Project Spec & Consultation)',
    quality: 'Rear/side view, no identifiable face, professional EPC atmosphere, crisp contrast.'
  },
  'medium-shot-engineers-talking-about-solar-pannels_23-2149352238': {
    subject: 'Two engineers in safety helmets discussing array layout with digital tablet',
    use: 'Ordering Steps — Step 2 (Formal Quotation & Engineering Review)',
    quality: 'Professional collaborative planning, clean composition, wind turbine in background.'
  },
  'panel-4902784_640': {
    subject: 'Close-up macro texture of monocrystalline solar cells with metallic busbars',
    use: 'Datasheet texture / Panel category background',
    quality: 'High sharpness, abstract technical geometry, zero text or logos.'
  },
  'panel-solar-energy-photovoltaic-power-roof-sun-home-cell-system-green-house-eco-industry_1117469-12245': {
    subject: 'Residential rooftop solar panels gleaming in direct noon sun',
    use: 'Rooftop applications / Solar Panels category banner',
    quality: 'Clean daylight photography, realistic roof framing.'
  },
  'photovoltaic-2138994_640': {
    subject: 'Macro angled view of photovoltaic cells showing crystalline silicon reflections and sky',
    use: 'Category Dock: Solar Panels card image',
    quality: 'Exquisite color depth, high-tech aesthetic, perfect fit for solar panels category card.'
  },
  'photovoltaic-2814504_640': {
    subject: 'Ground-mount solar arrays angled upward toward crisp blue sky',
    use: 'Gallery / Catalog header accent',
    quality: 'Clean, professional outdoor photography, no logos.'
  },
  'photovoltaic-4525177_640': {
    subject: 'Utility-scale solar array leading into distant horizon',
    use: 'About page: Bulk delivery section',
    quality: 'Good perspective lines, clean sky, no watermarks.'
  },
  'photovoltaic-6239403_640': {
    subject: 'Solar farm modules under clear summer sky',
    use: 'General catalog backdrop',
    quality: 'Crisp focus, realistic equipment mounting.'
  },
  'photovoltaic-6239423_640': {
    subject: 'Dual rows of tilted PV panels on aluminum support posts',
    use: 'Specifications breakdown / Racking illustration',
    quality: 'High mechanical detail on aluminum clamps and posts.'
  },
  'photovoltaic-modules-solar-power-plant_29332-1692': {
    subject: 'Industrial solar power plant in afternoon sunlight',
    use: 'About page hero / Facility scale proof',
    quality: 'Rich tone, commercial B2B scale, no logos.'
  },
  'photovoltaic-system-2742302_640': {
    subject: 'Industrial PV array with ground-mounted central tracker frame',
    use: 'About page: engineering standards',
    quality: 'Clean meadow installation, industrial hardware.'
  },
  'photovoltaic-system-2742304_640': {
    subject: 'Solar power plant with field tracker mount structures',
    use: 'Ordering Steps / EPC supply chain',
    quality: 'High quality documentary capture, no logos.'
  },
  'photovoltaic-system-2742306_640': {
    subject: 'Multi-panel array in green field',
    use: 'Wholesale product overview',
    quality: 'Clean outdoor capture.'
  },
  'photovoltaics-solar-power-station-energy-from-natural_169016-5821': {
    subject: 'Solar farm with high-voltage electrical transmission towers and transformer substation',
    use: 'Category Story: Inverters & Grid Synchronization',
    quality: 'Shows the critical connection between PV generation and electrical power grid conversion.'
  },
  'realistic-3d-photovoltaic-module-transparent_107791-19382': {
    subject: '3D model of solar panel with fake printed transparency checkerboard',
    use: 'Reject / Do not use',
    quality: 'Contains baked-in fake grey/white transparency checkerboard background.'
  },
  'renewable-energy-solar-panels-wind-turbines-green-grass-blue-sky_28943-541': {
    subject: 'Commercial solar field with wind turbines and bright blue sky',
    use: 'About page / Renewable infrastructure banner',
    quality: 'Vivid color, commercial installation scale.'
  },
  'renewable-solar-photovoltaic-power-station-plant_1464496-17': {
    subject: 'Square aerial view of utility solar installation',
    use: 'Square card thumbnail / Grid view',
    quality: 'Decent, slightly lower resolution (626x626).'
  },
  'solar-1476224_640': {
    subject: 'Long symmetrical rows of photovoltaic panels under bright sun',
    use: 'Bulk delivery & wholesale supply context',
    quality: 'Strong linear perspective, no logos.'
  },
  'solar-2666770_640': {
    subject: 'Solar panels row angled upward',
    use: 'Category detail view',
    quality: 'Good resolution, natural outdoor lighting.'
  },
  'solar-4824602_640': {
    subject: 'Solar panel close-up with intense sun lens flare radiating from corner',
    use: 'Hero section ambient background accent',
    quality: 'Dramatic lighting, high visual energy, evocative of solar power.'
  },
  'solar-8244680_640': {
    subject: 'Tilted solar arrays in industrial installation',
    use: 'Category story / Module efficiency slide',
    quality: 'Sharp focus, industrial mounting hardware.'
  },
  'solar-and-wind-power': {
    subject: 'Solar panels in foreground with modern wind turbines in background',
    use: 'Sustainability / Multi-MW project context',
    quality: 'Clean, no watermarks, good balance.'
  },
  'solar-cell-4045029_640': {
    subject: 'Extreme macro close-up of blue solar wafer silicon cell texture and silver busbars',
    use: 'Product spec card / N-Type TOPCon cell feature accent',
    quality: 'High macro clarity, beautiful technological blue silicon crystallization.'
  },
  'solar-cells-1707841_640': {
    subject: 'Patterned grid of monocrystalline silicon solar cells',
    use: 'Background pattern / Technical card header',
    quality: 'Clean geometric grid.'
  },
  'solar-energy-2157212_640': {
    subject: 'Wide landscape of solar farm during afternoon sun',
    use: 'Footer / Closing section accent',
    quality: 'Natural scenery, peaceful energy aesthetic.'
  },
  'solar-energy-panel-power-saving-instagram-post-social-media-banner-template_106176-4251': {
    subject: 'Social media graphic template with marketing text overlays and badges',
    use: 'Reject / Do not use',
    quality: 'Contains promotional placeholder typography and social media graphic banners.'
  },
  'solar-energy-panel-power-saving-instagram-post-social-media-banner-template_106176-4255': {
    subject: 'Social media graphic template with marketing text overlays',
    use: 'Reject / Do not use',
    quality: 'Contains baked-in social media typography and promotional badge frames.'
  },
  'solar-energy-power-plant-isolated-with-white-highlights_660230-187843': {
    subject: 'Vertical format solar plant on green hill with white sky',
    use: 'Vertical mobile banner',
    quality: 'Vertical aspect ratio, clean, no text.'
  },
  'solar-panel-5567530_640': {
    subject: 'Vertical close-up of solar module surface and aluminum frame',
    use: 'Mobile card accent',
    quality: 'Crisp vertical framing.'
  },
  'solar-panel-cell-dramatic-sunset-sky-clean-alternative-power-energy-concept_29332-1997': {
    subject: 'Solar panels reflecting dramatic orange, gold and purple sunset clouds',
    use: 'Closing CTA: Background visual card',
    quality: 'Cinematic color gradient, highly atmospheric, perfect backdrop for quote request.'
  },
  'solar-panel-generates-green-electricity_661209-25': {
    subject: 'Solar panels on modern industrial logistics facility roof',
    use: 'Warehouse & Logistics section / Wholesale importing proof',
    quality: 'High resolution, clean commercial architecture.'
  },
  'solar-panel-installation_1041545-49575': {
    subject: 'Two technicians securing solar module mounting clips on metal roof',
    use: 'Ordering Steps — Step 4 (Delivery & Handover)',
    quality: 'Shows physical handling, safety gloves, professional mounting technique.'
  },
  'solar-panel-is-set-against-blue-sky-with-sun-shining-through-it_1313119-5147': {
    subject: 'Sun flare bursting through transparent corner of bifacial solar module',
    use: 'Category Story: Bifacial glass-glass feature slide',
    quality: 'Clearly conveys double-sided bifacial light transmission.'
  },
  'solar-panel-is-set-up-farm_520665-25067': {
    subject: 'Utility solar farm rows with clean inverter trenching in foreground',
    use: 'Commercial EPC equipment supply context',
    quality: 'Strong clarity, authentic hardware installation.'
  },
  'solar-panel-with-sun-clouds_44446-460': {
    subject: 'Solar panel pointing up to fluffy white cumulus clouds and blue sky',
    use: 'Card illustration',
    quality: 'Square framing, clean natural light.'
  },
  'solar-panel-worker-showing-renewable-energy-sources_308072-3307': {
    subject: 'Technician presenting commercial solar farm with open hand gesture',
    use: 'About page: Direct importer promise',
    quality: 'Identifiable face; do NOT use as testimonial. Good for customer support/contact.'
  },
  'solar-panels-1149611_640': {
    subject: 'Array of crystalline solar panels under sunny sky',
    use: 'Catalog category thumbnail',
    quality: 'Sharp, clean, neutral tone.'
  },
  'solar-panels-field-sunset_922936-22590': {
    subject: 'Wide angle capture of solar farm row under brilliant glowing sun flare and blue sky',
    use: 'Hero Section: Ambient visual support behind layered product composition',
    quality: 'Top-tier commercial stock quality; vivid colors matching Volt-Lime and Charcoal tokens.'
  },
  'solar-panels-roof-solar-cell_335224-1324': {
    subject: 'Symmetrical industrial warehouse corrugated roof with solar panels facing radiant sunrise',
    use: 'About Page Hero / Category Dock Hero backdrop',
    quality: 'Stunning industrial B2B aesthetic, flawless symmetry, zero faces, zero logos.'
  },
  'solar-panels-sky-with-sun-them_979014-14679': {
    subject: 'Photovoltaic modules angled toward noon sun',
    use: 'Product catalog banner',
    quality: 'Clean exposure, high contrast.'
  },
  'solar-panels-used-renewable-energy-field-sky-full-clouds_181624-36781': {
    subject: 'Utility scale solar arrays with clouds gathering on horizon',
    use: 'About page: Container volume delivery',
    quality: 'Great depth of field, authentic industrial hardware.'
  },
  'solar-power-boards-3d-realistic-render_625553-171': {
    subject: '3D render of dual tilted solar panels on white pedestal with checkerboard watermark',
    use: 'Reject / Do not use',
    quality: 'Contains baked-in transparency checkerboard and text overlay.'
  },
  'solar-power-boards-3d-realistic-render_625553-173': {
    subject: '3D render of dual tilted solar panels with "SOLAR PANEL 3D RENDER" text',
    use: 'Reject / Do not use',
    quality: 'Contains text banner overlay at top.'
  },
  'solar-power-boards-roof-3d-realistic-render_625553-145': {
    subject: '3D realistic render of modern architectural house with rooftop solar modules',
    use: 'Residential solar solutions context',
    quality: 'Clean architectural 3D render, no text, no watermarks.'
  },
  'solar-power-power-station_1387-161': {
    subject: 'Commercial photovoltaic power station in rural meadow',
    use: 'Category story / Commercial project showcase',
    quality: 'Clear documentary style, natural lighting.'
  },
  'solar-power-station_1464496-216': {
    subject: 'Solar farm arrays with inverter string enclosures visible',
    use: 'Category Dock: Solar Inverters card image',
    quality: 'Shows inverter conversion boxes mounted directly on panel array supports.'
  },
  'solar-power-station-with-solar-panels-producing-electric-power-energy-by-green-power-technology-electrical-industrial-power-plant-concept-3d-illustration-rendering_10307-2111': {
    subject: 'Pristine 3D illustration of commercial solar arrays and central inverter stations on lush grass',
    use: 'Category Dock: Inverters & Power Conversion card image',
    quality: 'Pristine rendering, vivid green grass & volt-lime accents, clear inverter enclosures.'
  },
  'solar-power-tree-green-energy-innovation_191095-84678': {
    subject: 'Futuristic solar tree sculpture with photovoltaic leaves',
    use: 'Reject / Do not use',
    quality: 'Concept design, not representative of standard wholesale B2B equipment.'
  },
  'solar-powered-home_23-2151951213': {
    subject: 'Modern architectural residential home with integrated rooftop solar panels',
    use: 'Residential projects / Case studies',
    quality: 'High quality architectural photography.'
  },
  'solar-system-2939560_640': {
    subject: 'Close-up of solar array corner with mounting hardware',
    use: 'Technical specification detail',
    quality: 'Clean hardware capture.'
  },
  'stand-alone-solar-panel-system-installation-renewable-green-energy_10069-5644': {
    subject: 'Two technicians mounting solar module on rack with storage enclosure nearby',
    use: 'Ordering Steps — Step 3 (Container-Scale Logistics & Staging)',
    quality: 'Shows professional installation team, high resolution, authentic job site.'
  },
  'sunset-sky-reflects-solar-panel-sustainable-power-generation-generative-ai_188544-36908': {
    subject: 'Glowing sunset reflection on crystalline solar panels with golden light',
    use: 'Closing CTA: Background glow card / Contact banner',
    quality: 'Warm, evocative color tones, no logos, no faces.'
  },
  'technology-solar-cell-engineer-service-check-installation-solar-cell-roof-factory-morning_1028938-16863': {
    subject: 'Engineer in safety gear kneeling to inspect photovoltaic modules on industrial factory roof at sunrise',
    use: 'About Page: Main Facility / Engineering inspection showcase',
    quality: 'World-class industrial photography, incredible golden-hour lighting, pristine focus.'
  },
  'top-view-solar-panels-farm-alternative-source-electricity-solar-panels-absorb-sunlight-as-source-energy-generate-electricity-creating-sustainable-energy_620624-4451': {
    subject: 'Aerial perspective looking down long endless rows of utility solar panels in countryside',
    use: 'Category Story: Container Volume & Direct Importer Scale slide',
    quality: 'High-angle wide perspective, shows massive scale, crisp resolution.'
  },
  'two-asian-young-engineers-walking-along-rows-photovoltaic-panels-solar-farm-they-use-laptop-computer-talking-together_1150-57228': {
    subject: 'Two young engineers walking between solar panel rows with laptop computer reviewing telemetrics',
    use: 'Engineering Support / Technical Assistance context',
    quality: 'Identifiable faces; do NOT use as testimonial. Suitable for general engineering support.'
  },
  'two-engineers-installing-solar-panels-on-roof': {
    subject: 'Two technicians in yellow high-vis vests carefully placing a solar panel on commercial flat roof',
    use: 'About Page: Installation & Logistics showcase card',
    quality: 'Dynamic working posture, industrial rooftop background, crisp focus.'
  },
  'wind-power-solar-energy_35913-2194': {
    subject: 'Square photo of wind turbine and solar panels',
    use: 'Square card accent',
    quality: 'Slightly muted lighting.'
  },
  'wind-sun-and-water-energy': {
    subject: 'Renewable energy landscape with solar panels',
    use: 'Renewable portfolio context',
    quality: 'Decent resolution, clean landscape.'
  },
  'workers-building-solar-panel-system-on-roof-of-house-men-installing-photovoltaic-solar-module': {
    subject: 'Two technicians on pitched roof installing photovoltaic module',
    use: 'Roof installation guide / Residential context',
    quality: 'Action photography, no watermarks, good clarity.'
  },
  'young-asian-technician-man-standing-talking-smartphone-long-rows-photovoltaic-solar-panels-copy-space_1150-57281': {
    subject: 'Technician talking on smartphone in middle of solar panel field',
    use: 'Contact Page / Direct Hotline support card',
    quality: 'Clear customer assistance / communications context.'
  }
};

async function main() {
  console.log('Evaluated assets count:', Object.keys(EVALUATIONS).length);
}
main();
