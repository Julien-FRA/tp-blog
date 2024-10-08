const ArticleModel = require("../models/article");
const UserModel = require("../models/user");

// Création et sauvegarde d'un article
exports.create = async (req, res) => {
  if (!req.body.topic && !req.body.content) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }

  const userId = req.user.userId;

  const user = await UserModel.findById(userId);

  if (!user) {
    return res.status(404).send({ message: "User not found..." });
  }

  const article = new ArticleModel({
    userId: userId,
    author: user.name,
    date: new Date(),
    topic: req.body.topic,
    content: req.body.content,
  });

  await article
    .save()
    .then((data) => {
      res.send({
        message: "Article created successfully!!",
        article: data,
      });
    })
    .catch((err) => {
      res.send({
        message: err.message || "Some error occured while creating artcile",
      });
    });
};

// Récupérer tous les articles de la database
exports.findAll = async (req, res) => {
  try {
    const article = await ArticleModel.find();
    res.status(200).json(article);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Récupérer un article avec son id
exports.findOne = async (req, res) => {
  try {
    const article = await ArticleModel.findById(req.params.id);
    res.status(200).json(article);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.findUserArticle = async (req, res) => {
  const userId = req.user.userId;

  try {
    const article = await ArticleModel.find({ userId: userId });
    res.status(200).json(article);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Mise à jour d'un article avec son id
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const currentUserId = req.user.userId;

  const articleId = req.params.id;

  const article = await ArticleModel.findById(articleId);

  if (!article) {
    return res.status(404).send({ message: "Article not found..." });
  }

  const userArticleId = article.userId;

  if (currentUserId != userArticleId) {
    return res.status(401).send({ message: "Its not your article!" });
  }

  await ArticleModel.findByIdAndUpdate(articleId, req.body, {
    useFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Article not found",
        });
      } else {
        res.send({ message: "Article updated successfully!!" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

// Supprimer un article avec un id
exports.destroy = async (req, res) => {
  const currentUserId = req.user.userId;

  const articleId = req.params.id;

  const article = await ArticleModel.findById(articleId);

  if (!article) {
    return res.status(404).send({ message: "Article not found..." });
  }

  const userArticleId = article.userId;

  if (currentUserId != userArticleId) {
    return res.status(401).send({ message: "Its not your article!" });
  }

  await ArticleModel.findByIdAndDelete(articleId)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Article not found",
        });
      } else {
        res.send({
          message: "Article deleted successfully!!",
        });
      }
    })
    .catch((err) => {
      res.satus(500).send({
        message: err.message,
      });
    });
};
