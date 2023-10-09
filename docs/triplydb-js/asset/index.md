# Asset

Not all data can be stored as RDF data. For example images and video files use a binary format. Such files can also be stored in TriplyDB as Assets and can be integrated into the Knowledge Graph. Each asset has a specific identifier that can be used in the Knowledge Graph.

An asset is always uploaded per dataset, for which the function `uploadAsset()` is used. see [Dataset.uploadAsset()](/triplydb-js/dataset#datasetuploadassetassetname-string-filepath-string) for uploading an asset.

If the asset already has been created following functions can retrieve it from the dataset.
- [Dataset.getAsset(assetName: string, versionNumber?: number)](/triplydb-js/dataset#datasetgetassetname-string-version-number)
- [Dataset.getAssets()](/triplydb-js/dataset#datasetgetassets)


TriplyDB.js supports several functions to manipulate an asset on TriplyDB.


## Asset.addVersion(path: File | string)

Update an asset with a new version of the document using the `addVersion` function. The input of this function is a path to the file location that you want to update the asset with. The file you want to add as a new version does not in any ways have to correspond to the asset.

### Example

The following snippet uploads the an file `my-file.pdf` and upload it as the new version of the asset:

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('my-dataset')
const asset = await dataset.getAsset('my-asset')
await asset.addVersion('my-file.pdf')
```


## Asset.delete()

To delete an asset with all of its versions execute the `delete()` function.

### Example

The following snippet uploads the an file `my-file.pdf` and upload it as the new version of the asset:

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('my-dataset')
const asset = await dataset.getAsset('my-asset')
await asset.delete()
```


## Asset.getInfo(version?: number)

Returns information about this asset.

Information is returned in a dictionary object. Individual keys can be accessed for specific information values.

Optionally you can give the version number to retrieve the assetInfo of a particular version.

The information object for assets includes the following keys:

<dl>
  <dt><code>assetName</code></dt>
  <dd>The URL-friendly name of the asset.</dd>

  <dt><code>identifier</code></dt>
  <dd>The hexadecimal identifier of the asset</dd>

  <dt><code>createdAt</code></dt>
  <dd>The date and time on which the asset was created.</dd>

  <dt><code>url</code></dt>
  <dd>The url of the asset.</dd>

  <dt><code>versions</code></dt>
  <dd>An array containing all versions of the asset.</dd>

  <dt><code>uploadedAt</code></dt>
  <dd>The date and time on which the asset was uploaded.</dd>

  <dt><code>fileSize</code></dt>
  <dd>Number with the bytesize of the asset</dd>
</dl>

### Examples

- The following snippet prints the full information object for the asset called ‘my-asset’:

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('my-dataset')
const asset = await dataset.getAsset('my-asset')
console.log(await asset.getInfo())
```


## Asset.getVersionInfo(version: number)

Returns version specific information about this asset.

Information is returned in a dictionary object. Individual keys can be accessed for specific information values.

The version specific information object for assets includes the following keys:

<dl>
  <dt><code>id</code></dt>
  <dd>The hexadecimal identifier of the asset</dd>

  <dt><code>fileSize</code></dt>
  <dd>Number with the bytesize of the asset</dd>

  <dt><code>url</code></dt>
  <dd>The url of the asset.</dd>

  <dt><code>uploadedAt</code></dt>
  <dd>The date and time on which the asset was uploaded.</dd>
</dl>

### Examples

- The following snippet prints the version information object for the asset called ‘my-asset’ at version `1`:

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('my-dataset')
const asset = await dataset.getAsset('my-asset')
console.log(await asset.getVersionInfo(1))
```


## Asset.selectVersion(version: number)

With the `selectVersion()` function you can select a specific version of an Asset.
Each version corresponds to a iteration of the file that is added as an asset. The
argument of the `selectVersion()` function is a number of the version you want to retrieve.

### Example

To select the first asset from the list of assets use the selectVersion with the argument `1`.

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('my-dataset')
const asset = await dataset.getAsset('my-asset')
const versionedAsset = asset.selectVersion(1)
```


## Asset.toFile(path: string, version?: number)

The binary representation of an asset can be retrieved and written to file via the `asset.toFile()`
function. This function takes as input a string path to the download location and optionally a
version number.

### Example

To download the latest version of `my-asset` asset to the file `my-file-location.txt`.

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('my-dataset')
const asset = await dataset.getAsset('my-asset')
asset.toFile('my-file-location.txt')
```


## Asset.toStream(version?: number)

If instead of downloading the asset to a file for later usage you want to directly use the asset.
The `toStream()` functionality is available. This downloads the asset as a stream for use in a script.
The `toStream()` has as optional argument a version number.

### Example

To get the latest version of `my-asset` asset as a stream available.

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('my-dataset')
const asset = await dataset.getAsset('my-asset')
asset.toStream()
```