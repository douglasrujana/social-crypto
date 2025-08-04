import bs58 from 'bs58'
import { BN } from '@coral-xyz/anchor'

export const memcmphMinute = minute => ({
    memcmp: {
        offset: 8 + // Discriminator.
            32 + // Author public key.
            1 + // TIME ZONE.
            1 + // YEAR.
            1 + // MONTH.
            1 + // DAY.
            1, // HOUR.
        bytes: bs58.encode((new BN(minute, 'le')).toArray())
    }
})

// year month day hour minute [22, 4, 29, 1, 12]
export const memcmphDay = vecDay => ({
    memcmp: {
        offset: 8 + // Discriminator.
            32 + // Author public key.
            1, // TIME ZONE.
        bytes: vecDay
    }
})

export const memcmphHashtag = hashtag => ({
    memcmp: {
        offset: 8 + // Discriminator.
            32 + // Author public key.

            1 + // TIME ZONE.
            1 + // YEAR.
            1 + // MONTH.
            1 + // DAY.
            1 + // HOUR.
            1 + // MINUTES.
            1 + // SECONDS.

            8 + // Like.
            4, // Hashtag string prefix.
        bytes: bs58.encode(Buffer.from(hashtag)),
    }
})

export const memcmpAuthor = authorBase58PublicKey => ({
    memcmp: {
        offset: 8, // Discriminator.
        bytes: authorBase58PublicKey,
    }
})