import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Card } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ApiServices } from '../Api/api';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteDialog from "../components/deleteModel"



import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Delete';

export default function StickyHeadTable() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [productLength, setProductLength] = useState(0);
    const [editModelopen, setEditModelOpen] = useState(false);
    const [addProductModelopen, setAddProductModelOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [productName, setProductName] = useState("")
    const [productCategory, setProductCategory] = useState("")
    const [productPrice, setProductPrice] = useState("")
    const [productType, setProductType] = useState("")
    const [productDescription, setProductDescription] = useState("")
    const [productColor, setProductColor] = useState("")
    const [productHighlights, setProductHighlights] = useState("")
    const [productDetails, setProductDetails] = useState("")
    const [productSize, setProductSize] = useState("")
    const [primaryImage, setPrimaryImage] = useState("")
    const [productImages, setProductImages] = useState([])
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [productId, setProductId] = useState("")


    const handleClickDeleteOpen = () => {
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };

    // console.log("files", files)

    const handleClickEditModelOpen = (row) => {
        setProductId(row._id)
        setProductName(row.name)
        setProductCategory(row.category)
        setProductPrice(row.price)
        setProductType(row.type)
        setProductDescription(row.description)
        setProductColor(row.color)
        setProductHighlights(row.highlights)
        setProductDetails(row.detail)
        setProductSize(row?.size.join())
        setPrimaryImage(row?.primaryImage?.[0]?.URL)
        setProductImages(row?.image)
        console.log("productImages", productImages)
        setEditModelOpen(true);

    };



    const handleClickAddProductModelOpen = () => {
        setAddProductModelOpen(true);
    }

    const handleAddProductModelClose = () => {
        setAddProductModelOpen(false);
    };
    const handleEditModelClose = () => {
        setEditModelOpen(false);
    }

    const handleFileChange = (event) => {
        setFiles(prevFiles => [...prevFiles, ...event.target.files]);
    }
    const handleRemoveFile = (fileName) => {
        setFiles(files.filter(file => file.name !== fileName));
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handlePrimaryImageChage = (event) => {

        setPrimaryImage(URL.createObjectURL(event.target.files[0]))
    }
    const handleImageRemoveFile = (fileId) => {
        setProductImages(productImages.filter(file => file.Id !== fileId))
    }

    const handleProductImages = (event) => {
        const files = event.target.files
        const newImages = Array.from(files).map((data) => {
            return {
                Id: URL.createObjectURL(data),
                URL: URL.createObjectURL(data)
            }
        })

        setProductImages(prevFiles => [...prevFiles, ...newImages]);
        console.log("ProductImages", productImages)
    }

    const postData = async (formJson) => {
        const form = new FormData();
        form.append("name", formJson.name);
        form.append("category", formJson.category);
        form.append("type", formJson.type);
        form.append("color", formJson.color);
        form.append("description", formJson.description);
        form.append("price", formJson.price);
        formJson.images.forEach((file, index) => {
            form.append('images', file);
        });
        form.append("size", formJson.size);
        form.append("highlights", formJson.highlights);
        form.append("detail", formJson.detail);
        console.log("form", form)
        ApiServices.postItems(form).then((res) => {
            console.log(res)
            if (res.response_code === 201) {
                getData();
            }
        });
    };

    const updateData = async (productId, formJson) => {
        const form = new FormData();
        form.append("productName", formJson.productName);
        form.append("category", formJson.category);
        form.append("productType", formJson.productType);
        form.append("productColor", formJson.productColor);
        form.append("productDescription", formJson.productDescription);
        form.append("productPrice", formJson.productPrice);
        formJson.productImages.forEach((file, index) => {
            form.append('productImages', file);
        });

        form.append("primaryImage", formJson.primaryImage);

        form.append("productSize", formJson.productSize);
        form.append("productHighlights", formJson.productHighlights);
        form.append("productDetails", formJson.productDetails);
        console.log("form", form)
        ApiServices.updateItem(productId, form).then((res) => {
            console.log(res)
            if (res.response_code === 200) {
                getData();
            }
        });
    };

    useEffect(() => {
        getData();
    }, [page, rowsPerPage]);

    const getData = async () => {
        console.log("page", page);
        console.log("rowsPerPage", rowsPerPage);
        var json = {
            page: page,
            limit: rowsPerPage,
        };
        ApiServices.getItems(json)
            .then((res) => {
                console.log(res);
                if (res.response_code === 200) {
                    setProducts(res.result.data);
                    setProductLength(res.result.length);

                }
            })
            .catch((err) => console.log(err));
        window.scrollTo(0, 0);
    };

    const deletedata = async (data) => {
        ApiServices.deleteItem(data).then(res => {
            console.log(res)
            if (res.response_code === 200) {
                handleDeleteClose()
                getData();
            }
        })

    }

    return (
        <div className='my-5 p-3 mx-auto'>
            <div className='mt-3 p-2 d-flex justify-content-between'>
                <h4 className='mt-auto'>All Products</h4>
                <button onClick={() => handleClickAddProductModelOpen()} className='btn btn-outline-primary'>Add Product</button>

            </div>
            <Paper className='mt-3 border rounded' elevation={2}>
                <TableContainer component={Card} sx={{ minWidth: "900px" }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell className="fw-bolder">Image</TableCell>
                                <TableCell className="fw-bolder">Name</TableCell>
                                <TableCell className="fw-bolder">Category</TableCell>
                                <TableCell className="fw-bolder">Type</TableCell>
                                <TableCell className="fw-bolder">color</TableCell>
                                <TableCell className="fw-bolder">price</TableCell>
                                <TableCell className="fw-bolder">Edit</TableCell>
                                <TableCell className="fw-bolder">Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {products?.map((row, k) => (
                                <TableRow key={k} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        <img width={50} src={row.primaryImage[0].URL} alt='productimage' />
                                    </TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>{row.color}</TableCell>
                                    <TableCell>₹{row.price}</TableCell>
                                    <TableCell> <button onClick={() => handleClickEditModelOpen(row)} className='btn btn-outline-primary'>Edit</button></TableCell>
                                    <TableCell>
                                        <IconButton aria-label="delete" size="large">  <DeleteOutlineOutlinedIcon onClick={handleClickDeleteOpen} /* onClick={() => deletedata(row._id)} */ /></IconButton>
                                        <DeleteDialog handleDeleteClose={handleDeleteClose} deleteOpen={deleteOpen} deletedata={() => deletedata(row._id)} />
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Stack spacing={2} mt={5} direction="row" justifyContent="center">
                <Pagination
                    count={Math.ceil(productLength / rowsPerPage)}
                    page={page}
                    color="primary"
                    size="large"
                    onChange={handleChangePage}
                // variant="outlined"
                // shape="rounded"
                />
            </Stack>

            {/* Add Product Dialog start */}
            <Dialog
                open={addProductModelopen}
                onClose={handleAddProductModelClose}
                fullWidth
                maxWidth="lg"
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        console.log("formData", formData)
                        const formJson = Object.fromEntries(formData.entries());
                        formJson.category.toLowerCase()
                        formJson.images = files;
                        console.log("formJson.images", formJson.images)
                        postData(formJson);
                        handleAddProductModelClose();
                    },

                }}
            >
                <DialogTitle> Add Product</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="Product Name"
                        name="name"
                        label="Product Name"
                        type="text"
                        fullWidth
                    // variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="Product Category"
                        name="category"
                        label="Product Category"
                        type="text"
                        fullWidth
                    // variant="standard"
                    />

                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="Product color"
                        name="color"
                        label="Product color"
                        type="text"
                        fullWidth
                    // variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="Product type"
                        name="type"
                        label="Product type"
                        type="text"
                        fullWidth
                    // variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="Product discription"
                        name="description"
                        label="Product discription"
                        type="text"
                        fullWidth
                    // variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="Product price"
                        name="price"
                        label="Product price"
                        type="number"
                        fullWidth
                    // variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="Product Size"
                        name="size"
                        label="Product Size"
                        type="text"
                        fullWidth
                    // variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="Product Highlights"
                        name="highlights"
                        label="Product Highlights"
                        type="text"
                        fullWidth
                    // variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="Product Details"
                        name="detail"
                        label="Product Details"
                        type="text"
                        fullWidth
                    // variant="standard"
                    />
                    {/* <TextField
        autoFocus
        required
        margin="dense"
        id="Product image"
        name="Product image"
        onChange={handleFileChange}
        // label="Product image"
        type="file"
        fullWidth
        multiple
    // variant="standard"
    /> */}
                    <div className='d-flex'>


                        {files.map((file) => (
                            <div className='d-flex'>

                                <img
                                    key={file.name}
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '10px' }}
                                />
                                <CloseOutlinedIcon onClick={() => handleRemoveFile(file.name)} />
                            </div>
                        ))}

                    </div>
                    <input
                        type="file"
                        id="Product image"
                        name="images"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="Product image">
                        <Button variant="contained" component="span">
                            Upload Images
                        </Button>
                    </label>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddProductModelClose}>Cancel</Button>
                    <Button type="submit">Submit</Button>
                </DialogActions>
            </Dialog>

            {/* Add product Dialog End */}

            {/* Edit Product Dialog Start */}
            <Dialog
                open={editModelopen}
                onClose={handleEditModelClose}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        console.log("formData", formData)
                        const formJson = Object.fromEntries(formData.entries());
                        console.log("formJson", formJson)
                        formJson.category.toLowerCase()
                        formJson.primaryImage = primaryImage;
                        formJson.productImages = productImages;
                        console.log("formJson.primaryImage", formJson.primaryImage)
                        console.log("formJson.productImages", formJson.productImages)
                        updateData(productId, formJson)
                        handleEditModelClose();
                    },

                }}
            >
                <DialogTitle> Edit Product</DialogTitle>
                <DialogContent>
                    <div className='row'>
                        <div className='col-sm-6 d-flex flex-column align-items-center justify-content-around '>
                            <img width={250} src={primaryImage} alt="pic" />
                            <input
                                type="file"
                                id="Product image"
                                name="primaryImage"
                                onChange={handlePrimaryImageChage}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="Product image">
                                <Button className='my-2' variant="outlined" component="span">
                                    Upload Images
                                </Button>
                            </label>
                        </div>
                        <div className='col-sm-6'>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="Product Name"
                                name="productName"
                                label="Product Name"
                                type="text"
                                fullWidth
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            // onChange={ }
                            // variant="standard"
                            />
                            <div className='row'>
                                <div className='col-sm-6'>
                                    <TextField
                                        autoFocus
                                        required
                                        margin="dense"
                                        id="Product Category"
                                        name="category"
                                        label="Product Category"
                                        type="text"
                                        value={productCategory}
                                        onChange={(e) => setProductCategory(e.target.value)}
                                        fullWidth
                                    // variant="standard"
                                    />
                                </div>
                                <div className='col-sm-6'>
                                    <TextField
                                        autoFocus
                                        required
                                        margin="dense"
                                        id="Product type"
                                        name="productType"
                                        label="Product type"
                                        type="text"
                                        value={productType}
                                        fullWidth
                                        onChange={(e) => setProductType(e.target.value)}
                                    // variant="standard"
                                    />
                                </div>
                            </div>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="Product color"
                                name="productColor"
                                label="Product color"
                                type="text"
                                value={productColor}
                                onChange={(e) => setProductColor(e.target.value)}
                                fullWidth
                            // variant="standard"
                            />
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="Product price"
                                name="productPrice"
                                label="Product price"
                                type="number"
                                value={productPrice}
                                fullWidth
                                onChange={(e) => setProductPrice(e.target.value)}
                            // variant="standard"
                            />

                            <TextField

                                autoFocus
                                required
                                margin="dense"
                                id="Product Size"
                                name="productSize"
                                label="Product Size"
                                type="text"
                                fullWidth
                                value={productSize}
                                onChange={(e) => setProductSize(e.target.value)}
                            // variant="standard"
                            />


                        </div>
                    </div>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="Product discription"
                        name="ProductDescription"
                        label="Product discription"
                        type="text"
                        fullWidth
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                    // variant="standard"
                    />

                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="Product Highlights"
                        name="ProductHighlights"
                        label="Product Highlights"
                        type="text"
                        fullWidth
                        value={productHighlights}
                        onChange={(e) => setProductHighlights(e.target.value)}
                    // variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="Product Details"
                        name="productDetails"
                        label="Product Details"
                        type="text"
                        fullWidth
                        value={productDetails}
                        onChange={(e) => setProductDetails(e.target.value)}
                    // variant="standard"
                    />
                    <div className='d-flex'>
                        {productImages?.map((data) => (
                            <div className='d-flex'>
                                <img
                                    key={data.Id}
                                    src={data.URL}
                                    alt={data.URL}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '10px' }}
                                />
                                <CloseOutlinedIcon onClick={() => handleImageRemoveFile(data.Id)} />
                            </div>
                        ))}
                    </div>
                    <input
                        type="file"
                        id="Productimage"
                        name="productImages"
                        multiple
                        onChange={handleProductImages}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="Productimage">
                        <Button variant="contained" component="span">
                            Upload Images
                        </Button>
                    </label>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditModelClose}>Cancel</Button>
                    <Button type="submit">Submit</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Product Dialog End */}
        </div>
    );
}
