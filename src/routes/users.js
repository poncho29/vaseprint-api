const { Router } = require('express');
const { body, param } = require('express-validator');

const router = Router();

const { getUser,
        getUsers,
        createUser,
        updateUser,
        deleteUser } = require('../controllers/users');

const { validJwt, validRole, validFields } = require('../middlewares');
const { existUserById, existEmail, existRole, existRoles } = require('../helpers/dbValidators');     

// Public
router.get('/', getUsers);

// Public
router.get('/:id', [
  param('id').custom(existUserById),
  validFields
], getUser);

// Public
router.post('/', [
  body('name', 'El nombre es requerido').not().isEmpty(),
  body('phone', 'El teléfono es requerido').not().isEmpty(),
  body('phone', 'El teléfono debe tener 10 caracteres').isLength(10),
  body('email', 'El correo no es valido').isEmail(),
  body('email').custom(existEmail),
  body('password', 'La contraseña debe tener minimo 6 caracteres').isLength({ min: 6 }),
  body('roleId').custom(existRole),
  validFields
], createUser);

// Private - Solo un admin puede modificar un usuario
router.put('/:id', [
  validJwt,
  validRole,
  param('id').custom(existUserById),
  body('roleId').custom(existRole),
  validFields
], updateUser);

// Private - Solo un admin puede eliminar un usuario
router.delete('/:id', [
  validJwt,
  validRole,
  param('id').custom(existUserById),
  validFields
], deleteUser);

module.exports = router;