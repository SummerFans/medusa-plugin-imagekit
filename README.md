# medusa plugin imagekit
This is an ImageKit platform file plugin based on Medusa v2, including module dependencies and UI interface. Currently, it only displays ImageKit usage statistics. Hope this plugin helps you!


## ⚠️ Warn
>| Requires Medusa v2.7.0 or later.

## Installaction
```
npm i medusa-plugin-imagekit
```

## Configure

```js
// medusa-config.js
...
modules:[
  {
    resolve: "@medusajs/medusa/file",
    options: {
      providers: [
        {
          resolve: "medusa-plugin-imagekit/providers/file-imagekit",
            id: "file-imagekit",
            options: {
              publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
              privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
              imagekitID: process.env.IMAGEKIT_ID,
              folder: process.env.IMAGEKIT_FOLDER // default: `/medusa/`
          },
        }
      ]
    }
  }
]
plugins: [
    {
      resolve: "medusa-plugin-imagekit",
      options: {
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        imagekitID: process.env.IMAGEKIT_ID,
        folder: process.env.IMAGEKIT_FOLDER // default: `/medusa/`
      },
    }
]

```