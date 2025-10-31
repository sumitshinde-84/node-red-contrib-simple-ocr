const { createWorker } = require('tesseract.js');

module.exports = function(RED) {
    function SimpleOcrNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', async function(msg, send, done) {
            const image = msg.payload;

            if (!image || !(image instanceof Buffer)) {
                node.error("Payload must be an image buffer.", msg);
                if (done) { done(); }
                return;
            }

            const isPNG = image.length > 8 && image.toString('hex', 0, 4) === '89504e47';
            const isJPEG = image.length > 3 && image.toString('hex', 0, 3) === 'ffd8ff';
            const isGIF = image.length > 6 && image.toString('hex', 0, 3) === '474946';
            const isBMP = image.length > 2 && image.toString('hex', 0, 2) === '424d';

            if (!isPNG && !isJPEG && !isGIF && !isBMP) {
                const header = image.toString('hex', 0, 8);
                node.error(`Payload is not a recognized image format (PNG, JPEG, GIF, BMP). Buffer header: ${header}`, msg);
                if (done) { done(); }
                return;
            }

            node.status({ fill: "blue", shape: "dot", text: "recognizing..." });

            let worker;
            try {
                worker = await createWorker();
                
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(image);
                
                msg.payload = text;
                node.status({});
                send(msg);

            } catch (err) {
                node.error("OCR processing failed: " + err.message, msg);
                node.status({ fill: "red", shape: "ring", text: "failed" });
            } finally {
                if (worker) {
                    await worker.terminate();
                }
                if (done) {
                    done();
                }
            }
        });
    }
    RED.nodes.registerType("simple-ocr", SimpleOcrNode);
}