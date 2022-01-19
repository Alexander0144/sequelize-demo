const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const db = require("../config/database");
const Gig = require("../models/Gig");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

/**
 * get gig list
 */
router.get("/", async (req, res) => {
    try {
        const gigs = await Gig.findAll();
        const data = gigs.map( g => {
            return {
                title: g.title, 
                technologies: g.technologies,
                budget: g.budget,
                description: g.description,
                contact_email: g.contact_email
            }
        })
        res.status(200).render('gigs', { gigs: data });
    } catch (error) {
        res.status(500).json({"error": error.message});
    }
});

/**
 * Get add Gig form
 */
router.get("/add", (req, res) => {
    res.render("add");
});

/**
 * Add a gig
 */
router.post("/add", async (req, res) => {
    try {
        let { title, technologies, budget, description, contact_email } = req.body;
        const errors = [];

        if(!title) {
            errors.push("Please add a title");
        }

        if(!technologies) {
            errors.push("Please add technologies");
        }

        if(!description) {
            errors.push("Please add a description");
        }

        if(!contact_email) {
            errors.push("Please add a contact email");
        }

        if(errors.length) {
            res.status(400).render('add', {
                errors,
                title,
                technologies,
                budget,
                description,
                contact_email
            });
        } else {
            if(!budget) {
                budget = "Unknown";
            } else {
                budget = `$ ${budget}`;
            }
            const newGig = {
                title,
                technologies,
                description,
                budget,
                contact_email
            };
            const result = await Gig.create(newGig);
            console.log('Sequelize create result: ' + JSON.stringify(result));
            res.status(201).json({message: "Created gig", data: newGig});
        }
    } catch (error) {
        res.status(500).json({"error": error.message});
    }
});

router.get("/search", async (req, res) => {
    try {
        const { term } = req.query;
        const result = await Gig.findAll({ where: { technologies: { [Op.like]: "%" + term + "%"}}});
        const gigs = result.map( g => {
            return {
                title: g.title, 
                technologies: g.technologies,
                budget: g.budget,
                description: g.description,
                contact_email: g.contact_email
            }
        });
        res.status(200).render('gigs', {gigs});
    } catch (error) {
        res.status(500).json({"error": error.message});
    } 
});

module.exports = router;