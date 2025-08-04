export class Post {
    constructor(publicKey, accountData) {

        if (!publicKey) {
            return;
        }

        this.publicKey = publicKey

        this.author = accountData.author

        this.content = accountData.content
        this.hashtag = accountData.hashtag
        this.url = accountData.url

        this.like = accountData.like
        this.likes = accountData.likes

        this.time_zone = accountData.timeZone

        this.year = accountData.year + 2000
        this.month = accountData.month
        this.day = accountData.day
        this.hour = accountData.hour
        this.minutes = accountData.minutes
        this.seconds = accountData.seconds

        this.tip = 0

        // console.log(this.month, this.day, this.hour);
    }

    get key() {
        return this.publicKey.toBase58()
    }

    get key_display() {
        const publicKey = this.publicKey.toBase58()
        return publicKey.slice(0, 4) + '...'
    }

    get author_display() {
        const author = this.author.toBase58()
        return author.slice(0, 4) + '..' + author.slice(-4)
    }

    get date_publication() {
        return new Date(Date.UTC(this.year, this.month, this.day, this.hour, this.minutes, this.seconds)).toLocaleString()
    }

    get content_html() {
        const exp1 = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
        let content = this.content.replace(exp1, "<a href='$1' target='_blank'>$1</a>");

        const exp2 = /(^|[^@\w])@(\w{1,40})\b/g
        content.replace(exp2, "$1<a href='http://instagram.com/$2' target='_blank'>@$2</a>");

        const exp3 = /(^|\s)#(\w*[a-zA-Z]+\w{2,22})/g
        return content.replace(exp3, "$1<a href='#/juno/ht/$2'> #$2 </a>");
    }

    get url_dominio() {
        return `https://ipfs.infura.io/ipfs/${this.url.toString().substring(2)}`
        // return `https://${this.url.toString().substring(2)}`
    }

    get mind() {
        return this.url.toString().substring(0, 1)
    }

    isLike = (wallet) => {
        if (!wallet)
            return false
        const index = this.likes.findIndex((obj => obj.toBase58() === wallet.publicKey.toBase58()))
        return index > -1
    }

}