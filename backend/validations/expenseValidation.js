import Joi from 'joi';

export const expenseSchema = Joi.object({
    title: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Title is required',
        'string.min': 'Title should be at least 3 characters'
    }),
    amount: Joi.number().positive().required().messages({
        'number.positive': 'Amount must be greater than zero',
        'any.required': 'Amount is required'
    }),
    category: Joi.string()
        .valid('Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Studies', 'Others')
        .required()
        .messages({
            'any.only': 'Please select a valid category'
        }),
    date: Joi.date().iso().max('now').required().messages({
        'date.max': 'Date cannot be in the future'}),
    notes: Joi.string().max(200).allow('', null)
});