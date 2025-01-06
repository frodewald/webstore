const db = require('../models')
const bcrypt = require('bcryptjs');

const hashPassword = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pass, salt);
  return hash
}

const User = db.users
const Order = db.orders

exports.register = async (req, res) => {
    try {
        const { username, email, password, confirmpass } = req.body;

        if (!username || !email || !password || !confirmpass) {
            return res.status(400).json({
                message: 'Data tidak boleh kosong'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: 'format email tidak valid'
            });
        }

        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character."
            });
        }

        if (password !== confirmpass) {
            return res.status(400).send({
                message: 'Password dan konfirmasi password tidak cocok.'
            });
        }
        
        const hashedPassword = await hashPassword(password);

        const isUserInDB = await User.findOne({ username: username })
        if (isUserInDB) {
            return res.status(404).send({
                message: 'username sudah dipakai',
            });
        }

        const isEmailInDb = await User.findOne({ email: email })
        if (isEmailInDb) {
            return res.status(404).send({
                message: 'email sudah pernah dipakai',
            });
        }
        
        const userData = {
            username: String(username),
            email: String(email),
            password: String(hashedPassword),
            role: "customer"
        };
        
        const resultUser = await User.create(userData);

        const createOrderWithId = {
            user_id: resultUser._id,
            cart_items: []
        };
        console.log('Order Data:', createOrderWithId);
        
        const resultOrder = await Order.create(createOrderWithId)
        console.log('Order Created:', resultOrder);
        
        req.session.user_id = resultUser._id

        res.status(201).send({
            message: 'User registered successfully',
            user: resultUser
        });
    } catch (err) {
        res.status(409).send({
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const getUser = await User.findOne({ username: username });

        if (!getUser) {
            return res.status(404).send({
                message: 'User not found',
            });
        }

        const comparePassword = await bcrypt.compare(password, getUser.password);
        
        if(!comparePassword) {
            return res.status(404).send({
                message: 'Password Invalid'
            })
        }

        req.session.user_id = getUser._id
        req.session.role = getUser.role
        res.status(200).send({
            message: 'Login successfully',
            user: getUser
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send({
            message: err.message
        });
    }
}

exports.getUser = async (req, res) => {
    try {
        const userId = req.session.user_id
        const getUser = await User.findOne({ _id: userId });

        res.status(200).send({
            message: 'Get User Successfully',
            user: getUser
    });
    } catch(err) {
        console.error('Error during login:', err);
        res.status(500).send({
            message: err.message
        });
    }
}

exports.logout = async (req, res) => {
    req.session.destroy(err => {
    if (err) {
        return res.status(500).json({ message: 'Logout failed' });
    }
    
    // Hapus cookie session di client
    res.clearCookie('connect.sid'); // Sesuaikan dengan nama cookie session yang digunakan
    return res.status(200).json({ message: 'Logged out successfully' });
    });
}

exports.updateUser = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const { username, email, alamat, telepon } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No session found' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, // ID user yang diambil dari session
            {
              username,
              email,
              alamat,
              telepon,
            },
            { new: true, runValidators: true } // 'new: true' mengembalikan dokumen yang telah diperbarui
        );

        // Jika user tidak ditemukan
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Kirim data user yang telah diperbarui sebagai response
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        // Mengambil semua user
        const users = await User.find(); // Mengambil semua user tanpa kondisi
        console.log(users);

        res.status(200).send({
            message: 'Get All Users Successfully',
            users: users
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send({
            message: err.message
        });
    }
}
