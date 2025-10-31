# node-red-contrib-simple-ocr

A simple [Node-RED](https://nodered.org) node to perform Optical Character Recognition (OCR) on images using [tesseract.js](https://tesseract.projectnaptha.com/).

## Installation

Install via the Node-RED palette manager or by running the following command in your Node-RED user directory (typically `~/.node-red`):

```bash
npm install @sumit_shinde_84/node-red-contrib-simple-ocr
```

## Usage

This node performs OCR on an image provided in the `msg.payload`.

### Inputs

- `payload` (Buffer): An image buffer to be processed. The image can be in PNG, JPEG, GIF, or BMP format.

### Outputs

- `payload` (string): The recognized text from the image.

### Details

The node will display its progress while recognizing the text. It will show a "recognizing..." status while processing the image.

## Example Flow

You can use an `http in` node to receive an image file and pass it to the `simple-ocr` node. The recognized text can then be seen in the debug panel.

## License

This project is licensed under the [Apache-2.0 License](LICENSE).
