const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Complete full product inventory pool with all models
const products = [
    // === GRAPHICS CARDS (GPUs) ===
    { id: 1, name: "ASUS Dual GeForce RTX 4060 EVO OC 8GB", price: 18495.00, category: "GPU" },
    { id: 2, name: "Palit GeForce RTX 4060 Ti Dual 8GB", price: 25225.00, category: "GPU" },
    { id: 3, name: "Gigabyte RTX 4060 Eagle OC 8GB", price: 21675.00, category: "GPU" },
    { id: 4, name: "ASUS TUF Gaming GeForce RTX 4070 Super 12GB", price: 44250.00, category: "GPU" },
    { id: 5, name: "ROG Strix GeForce RTX 4090 OC Edition 24GB", price: 125000.00, category: "GPU" },
    { id: 6, name: "MSI GeForce RTX 4070 Ti Super Gaming X Slim 16GB", price: 54950.00, category: "GPU" },
    { id: 7, name: "Sapphire Pulse AMD Radeon RX 7800 XT 16GB", price: 32450.00, category: "GPU" },
    { id: 8, name: "PowerColor Hellhound AMD Radeon RX 7900 XTX 24GB", price: 65900.00, category: "GPU" },

    // === PROCESSORS (CPUs) ===
    { id: 11, name: "AMD Ryzen 5 5600 6-Core 12-Thread Boxed", price: 7390.00, category: "CPU" },
    { id: 12, name: "AMD Ryzen 5 7600 6-Core 5.1GHz Boxed", price: 11095.00, category: "CPU" },
    { id: 13, name: "AMD Ryzen 7 7800X3D Gaming Processor AM5", price: 24200.00, category: "CPU" },
    { id: 14, name: "Intel Core i5-12400F Midrange Boxed CPU", price: 7250.00, category: "CPU" },
    { id: 15, name: "Intel Core i7-14700K Cache LGA1700 CPU", price: 25950.00, category: "CPU" },
    { id: 16, name: "Intel Core i9-14900K Flagship LGA1700 CPU", price: 36450.00, category: "CPU" },
    { id: 17, name: "AMD Ryzen 9 7950X 16-Core 32-Thread AM5 CPU", price: 33800.00, category: "CPU" },

    // === MOTHERBOARDS ===
    { id: 21, name: "MSI B550M Pro-VDH WiFi AM4 Board", price: 6295.00, category: "Motherboard" },
    { id: 22, name: "MSI PRO B650M-A WiFi DDR5 mATX", price: 9850.00, category: "Motherboard" },
    { id: 23, name: "ASUS ROG Strix B650-A Gaming WiFi", price: 15400.00, category: "Motherboard" },
    { id: 24, name: "ASUS TUF Gaming B760M-Plus WiFi II", price: 11450.00, category: "Motherboard" },
    { id: 25, name: "Gigabyte Z790 AORUS ELITE AX LGA1700", price: 17250.00, category: "Motherboard" },
    { id: 26, name: "ASRock X670E Steel Legend AM5 ATX Board", price: 19800.00, category: "Motherboard" },

    // === MEMORY KITS (RAM) ===
    { id: 31, name: "G.Skill Ripjaws V 16GB Dual DDR4 3200MHz", price: 2825.00, category: "RAM" },
    { id: 32, name: "Corsair Vengeance 32GB Kit (2x16GB) DDR5 6000", price: 7450.00, category: "RAM" },
    { id: 33, name: "G.Skill Trident Z5 Neo RGB 32GB DDR5 6000", price: 8150.00, category: "RAM" },
    { id: 34, name: "TeamGroup T-Force Delta RGB 32GB DDR5 6400MHz", price: 7950.00, category: "RAM" },
    { id: 35, name: "Kingston Fury Beast RGB 16GB DDR4 3600MHz Kit", font: 3150.00, price: 3150.00, category: "RAM" },

    // === STORAGE (SSDs) ===
    { id: 41, name: "Kingston NV2 PCIe 4.0 NVMe M.2 1TB", price: 3950.00, category: "Storage" },
    { id: 42, name: "Samsung 990 PRO NVMe M.2 PCIe 4.0 1TB", price: 6850.00, category: "Storage" },
    { id: 43, name: "Samsung 990 PRO NVMe M.2 PCIe 4.0 2TB", price: 11200.00, category: "Storage" },
    { id: 44, name: "Crucial P3 Plus PCIe Gen4 M.2 NVMe 2TB", price: 8450.00, category: "Storage" },
    { id: 45, name: "Western Digital Black SN850X NVMe 1TB", price: 6200.00, category: "Storage" },

    // === COOLING SYSTEMS ===
    { id: 51, name: "Thermalright Peerless Assassin 120 SE CPU", price: 2450.00, category: "Cooling" },
    { id: 52, name: "DeepCool LT720 WH 360mm Premium AIO", price: 7200.00, category: "Cooling" },
    { id: 53, name: "NZXT Kraken 360 RGB Liquid Cooler LCD", price: 13950.00, category: "Cooling" },
    { id: 54, name: "Corsair iCUE H150i Elite Capellix XT AIO", price: 12450.00, category: "Cooling" },

    // === POWER SUPPLIES (PSUs) ===
    { id: 61, name: "Corsair CV650 Bronze 650W Power Supply", price: 3240.00, category: "Power Supply" },
    { id: 62, name: "Seasonic Focus GX-750 750W 80+ Gold", price: 6550.00, category: "Power Supply" },
    { id: 63, name: "MSI MAG A850GL 850W PCIe 5.0 ATX 3.0", price: 6450.00, category: "Power Supply" },
    { id: 64, name: "Corsair RM1000e 1000W PCIe 5.0 80+ Gold", price: 10950.00, category: "Power Supply" },

    // === CASES ===
    { id: 71, name: "Tecware Flow M mATX High Airflow Case", price: 1950.00, category: "Case" },
    { id: 72, name: "NZXT H5 Flow Compact Mid-Tower Chassis", price: 5450.00, category: "Case" },
    { id: 73, name: "Lian Li O11 Vision Dual-Chamber Premium", price: 9450.00, category: "Case" },
    { id: 74, name: "Montech Sky Two ARGB Dual-Glass Case", price: 4750.00, category: "Case" },

    // === PERIPHERALS ===
    { id: 81, name: "Logitech G102 Lightsync RGB Mouse", price: 1150.00, category: "Peripherals" },
    { id: 82, name: "Logitech G304 Lightspeed Wireless Mouse", price: 1995.00, category: "Peripherals" },
    { id: 83, name: "Logitech G Pro X Superlight 2 Wireless", price: 8990.00, category: "Peripherals" },
    { id: 84, name: "Aula F75 Tri-Mode Gasket Mechanical Keyboard", price: 2350.00, category: "Peripherals" },
    { id: 90, name: "Wooting 60HE+ Hall Effect Analog Keyboard", price: 13500.00, category: "Peripherals" },
    { id: 91, name: "Razer DeathAdder V3 Pro Wireless Ergonomic", price: 8450.00, category: "Peripherals" },
    { id: 92, name: "ASUS ROG Azoth 75% Wireless Custom Board", price: 14200.00, category: "Peripherals" }
];

app.get('/api/products', (req, res) => { res.json(products); });

app.listen(PORT, () => console.log(`🚀 PC Builder App Running at: http://localhost:3000`));