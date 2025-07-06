import Tanaman from "../models/Tanaman.js";


const createTanaman = async (req, res, next) => {
    try {
        const { nama, umur, tinggi, warna } = req.body;

        const tanaman = await Tanaman.findOne({ nama, umur, tinggi, warna });

        if(tanaman) {
            const error = new Error("Tanaman is already created!");
            return next(error);
        }

        const newTanaman = new Tanaman({
            nama,
            umur,
            tinggi,
            warna
        })

        const savedTanaman = await newTanaman.save();

        return res.status(201).json(savedTanaman);

    } catch (error) {
        next(error);
    }
};

const getSingleTanaman = async (req, res, next) => {
    try {
        const tanaman = await Tanaman.findById(
            req.params.tanamanId
        );

        if(!tanaman) {
            const error = new Error("Tanaman was not found!");
            return next(error)
        }

        return res.json(tanaman);
    } catch (error) {
        next(error)
    }
};

const getAllTanaman = async (req, res, next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if(filter) {
            where.nama = { $regex: filter, $options: "i"};
        }
        let query = Tanaman.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await Tanaman.find(where).countDocuments();
        const pages = Math.ceil(total / pageSize);

        res.header({
            "x-filter" : filter,
            "x-totalcount" : JSON.stringify(total),
            "x-currentpage" : JSON.stringify(page),
            "x-pagesize" : JSON.stringify(pageSize),
            "x-totalpagecount" : JSON.stringify(pages),
        });

        if (page > pages) {
            return res.json([])
        }

        const result = await query
            .skip(skip)
            .limit(pageSize)
            .sort({ updatedAt: "desc" });

        return res.json(result);
    } catch (error) {
        next(error)
    }
}

const updateTanaman = async (req, res, next) => {
    try {
        const { nama, umur, tinggi, warna } = req.body;

        const tanaman = await Tanaman.findByIdAndUpdate(
            req.params.tanamanId,
            {
                nama,
                umur,
                tinggi,
                warna
            },
            {
                new: true,
            }
        );

        if(!tanaman) {
            const error = new Error("Tanaman was not found");
            return next(error);
        }

        return res.json(tanaman);
    } catch (error) {
        next(error)
    }
}

const deleteTanaman = async (req, res, next) => {
    try {
        const tanamanId = req.params.tanamanId;

        await Tanaman.deleteOne({ _id: tanamanId });

        res.send({
            message: "Tanaman berhasil dihapus!"
        });
    } catch (error) {
        next(error);
    }
}


const getAllTanamanData = async (req, res, next) => {
  try {
    const data = await Tanaman.find().sort({ updatedAt: -1 }); // Urutkan dari yang terbaru
    res.json(data);
  } catch (error) {
    console.error("❌ Gagal mengambil semua data tanaman:", error);
    res.status(500).json({ message: "Gagal mengambil data tanaman" });
  }
};


export {
    createTanaman,
    getAllTanaman,
    updateTanaman,
    deleteTanaman,
    getSingleTanaman,
    getAllTanamanData
}