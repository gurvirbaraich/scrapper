async function workerMain(req, res, page) {
  const { url } = req.query;

  const response = {
    error: null,
    markup: null,
    status: 200,
  };

  try {
    await page.goto(url);
    response.markup = await page.content();
  } catch (error) {
    response.status = 500;
    response.markup = null;
    response.error = error.message;
  }

  await page.close();
  return res.json(response);
}

module.exports = {
  workerMain,
};
