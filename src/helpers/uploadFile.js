import * as ipfsClient from "ipfs-http-client"

const ipfs = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
});

const uploadToIpfs = async (base64) => {
    const imageFileBuffer = Buffer.from(base64, 'base64')
    const uploadedImage = await ipfs.add(imageFileBuffer)
    if (!uploadedImage) {
        return null
    }
    //Dominio https://ipfs.infura.io/ipfs/
    return `${uploadedImage.path}`
};

export default uploadToIpfs