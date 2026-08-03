// MARON Geomatics Site Configuration & Content Data
const defaultSiteData = {
    brandName: "MARON",
    hero: {
        tagline: "SECTORS WE SERVE",
        title: "Tailored Spatial Solutions for Key Industries",
        description: "Empowering decision-makers across critical development and industrial sectors with high-density point clouds, LiDAR precision, and UAV drone mapping in MEA.",
        buttonText: "Explore Solutions"
    },
    stats: [
        { value: "150,000+", label: "Hectares Mapped" },
        { value: "120+", label: "Infrastructure Projects" },
        { value: "0.01m", label: "LiDAR Accuracy Grade" },
        { value: "100%", label: "Client Satisfaction" }
    ],
    sectors: [
        {
            title: "Roads & Highways",
            description: "Alignment surveys, corridor mapping, cross-sections, and millimeter setting out.",
            image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Infrastructure & Rail",
            description: "High-density point clouds, deformation monitoring, and utility mapping.",
            image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Solar & Renewable Energy",
            description: "Topographic site characterization, panel layout setting out, and slope analysis.",
            image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Mining & Quarries",
            description: "Drone-based volumetric stockpiles, open-pit face mapping, and pit expansion monitoring.",
            image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Real Estate & Development",
            description: "Cadastral boundary confirmation, architectural BIM scanning, and site elevation models.",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Oil & Gas & Industrial",
            description: "As-built plant scanning, pipe rack modeling, and offshore/onshore facility mapping.",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
        }
    ],
    projects: [
        {
            title: "Cairo Highway Corridor LiDAR Mapping",
            category: "Roads & Highways",
            description: "UAV drone survey and mobile LiDAR scanning for 45km alignment project.",
            image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Industrial Plant 3D BIM Scanning",
            category: "Oil & Gas",
            description: "Millimeter-accurate point cloud generation for facility expansion modeling.",
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Solar Farm Topography & Contour Mapping",
            category: "Renewable Energy",
            description: "High-speed aerial photogrammetry over 1,200 feddans for PV array alignment.",
            image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80"
        }
    ],
    contact: {
        email: "info@marongeomatics.com",
        phone: "+20 100 000 0000",
        address: "Cairo, Egypt / MEA Region",
        emailjsKey: "",
        emailjsService: "",
        emailjsTemplate: ""
    }
};

function getSiteData() {
    const stored = localStorage.getItem('maron_site_data');
    if (stored) {
        try { return JSON.parse(stored); } catch(e) {}
    }
    return defaultSiteData;
}

function saveSiteData(data) {
    localStorage.setItem('maron_site_data', JSON.stringify(data));
}