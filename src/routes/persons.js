const { Router } = require('express');
const { body, param } = require('express-validator');

const router = Router();

const { getPerson,
        getPersons,
        createPerson,
        updatePerson,
        deletePerson } = require('../controllers/person');

const { validJwt, validRole, validFields } = require('../middlewares');
const { existUserById, existEmail, existRole, existPersonById, existRoles } = require('../helpers/dbValidators');     

// Public
router.get('/', getPersons);

// Public
router.get('/:id', [
  param('id').custom(existPersonById),
  validFields
], getPerson);

// Public
router.post('/', [
  body('name', 'El nombre es requerido').not().isEmpty(),
  body('phone', 'El phone es requerido').not().isEmpty().isLength(10),
  body('user.email', 'El correo no es valido').isEmail(),
  body('user.email').custom(existEmail),
  body('user.password', 'La contraseña debe tener minimo 6 caracteres').isLength({ min: 6 }),
  body('user.roleId').custom(existRole),
  validFields
], createPerson);

// Private - Solo un admin puede modificar un usuario
router.put('/:id', [
  validJwt,
  validRole,
  param('id').custom(existUserById),
  validFields
], updatePerson);

// Private - Solo un admin puede eliminar un usuario
router.delete('/:id', [
  validJwt,
  validRole,
  param('id').custom(existUserById),
  validFields
], deletePerson);

module.exports = router;