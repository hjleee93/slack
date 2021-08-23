const db = require('../model')
const Tutorial = db.tutorial;

const Op = db.sequelize.Op;

// Create tutorial 
class tutorialController {


    create = (req: any, res: any) => {
        // Validate request 
        if (!req.body.title) {
            res.status(400).send({message: 'Title is empty!'});
            return;
        }
        // Set tutorial 
        const tutorial =
            {
                title: req.body.title,
                description: req.body.description,
                published: req.body.published ? req.body.published : false
            };
        // Save tutorial 
        Tutorial
            .create(tutorial)
            .then((data: any) => {
                res.send(data);
            })
            .catch((err: { message: any; }) => {
                res.status(500)
                    .send({message: err.message || 'Create tutorial failure.'});
            });
    };

    // Retrieve all tutorials 
    findAll = (req: any, res: any) => {
        const title = req.query.title;
        let condition = {where: {}};

        // if (keyword) {
        //     condition = { where: { [Op.or]: [{ title: { [Op.like]: `%${keyword}%` } }, { description: { [Op.like]: `%${keyword}%` } }] } }
        // };
        Tutorial.findAll(condition)
            .then((data: any) => {
                res.send(data);
            })
            .catch((err: { message: any; }) => {
                res.status(500).send({message: err.message || 'Retrieve all tutorials failure.'});
            });
    };

    // Retrieve tutorial by id 
    findOne = (req: any, res: any) => {
        const id = req.params.id;
        Tutorial.findByPk(id).then((data: any) => {
            res.send(data);
        })
            .catch((err: { message: any; }) => {
                res.status(500).send({message: err.message || 'Retrieve tutorial failure. (id: ' + id + ')'});
            });
    };

    // Update tutorial by id 
    update = (req: any, res: any) => {
        const id = req.params.id;
        const condition = id ? {where: {id: id}} : null;

        Tutorial.update(req.body, condition)
            .then((resultCount: number) => {
                if (resultCount == 1) {
                    res.send({message: 'Tutorial updated.'});
                } else {
                    res.send({message: 'Cannot update tutorial. (id: ' + id + ')'});
                }
            })
            .catch((err: { message: any; }) => {
                res.status(500).send({message: err.message || 'Update tutorial failure. (id: ' + id + ')'});
            });
    };

    // Delete tutorial by id 
    delete = (req: any, res: any) => {
        const id = req.params.id;
        const condition = id ? {where: {id: id}} : null;
        Tutorial.destroy(condition)
            .then((resultCount: number) => {
                if (resultCount == 1) {
                    res.send({message: 'Tutorial deleted.'});
                } else {
                    res.send({message: 'Cannot delete tutorial. (id: ' + id + ')'});
                }
            })
            .catch((err: { message: any; }) => {
                res.status(500).send({message: err.message || 'Delete tutorial failure. (id: ' + id + ')'});
            });
    };
}

export default new tutorialController;