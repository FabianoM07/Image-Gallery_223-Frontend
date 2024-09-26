import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { Box, Button, TextField } from '@mui/material';
import { object, string } from 'yup';
import { ImagePostDTO } from '../../../types/models/ImagePost.model';
import PostImageService from '../../../Services/PostImageService';
import {useNavigate} from "react-router-dom";
import ActiveUserContext from "../../../Contexts/ActiveUserContext";


type PostFormProps = {
    initialValues?: ImagePostDTO;
    onSubmit: (values: ImagePostDTO) => void;
};

const PostForm: React.FC<PostFormProps> = ({ initialValues, onSubmit }) => {
    const { user } = useContext(ActiveUserContext);
    const navigate = useNavigate();


    const formik = useFormik({
        initialValues: initialValues || {
            url: '',
            description: '',
            likes: 0,
            author: {
                id: '',
                firstName: '',
                lastName: '',
            },
        },
        validationSchema: object({
            url: string().url('Must be a valid URL').required('URL is required'),
            description: string().required('Description is required').min(10, 'Too short').max(500, 'Too long'),
            author: object({
                id: string().required('Author ID is required'),
                firstName: string().required('First name is required'),
                lastName: string().required('Last name is required'),
            }),
        }),
        onSubmit: async (values) => {
            if (!user) {
                alert('User is not logged in');
                return;
            }

            try {

                await PostImageService.createImagePost({
                    ...values,
                    author: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }
                });
                alert('Post created successfully');
                navigate(`/home`);
            } catch (error) {
                alert('Error creating post');
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box sx={{ paddingTop: '15px' }}>
                <TextField
                    id="url"
                    label="URL"
                    variant="outlined"
                    sx={{ paddingRight: '10px' }}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={Boolean(formik.touched.url && formik.errors.url)}
                    value={formik.values.url}
                />
                {formik.errors.url && formik.touched.url ? (
                    <div style={{ color: 'red' }}>{formik.errors.url}</div>
                ) : null}

                <TextField
                    id="description"
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={Boolean(formik.touched.description && formik.errors.description)}
                    value={formik.values.description}
                />
                {formik.errors.description && formik.touched.description ? (
                    <div style={{ color: 'red' }}>{formik.errors.description}</div>
                ) : null}


                <TextField
                    id="author.firstName"
                    label="Author First Name"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.author.firstName}
                />
                {formik.errors.author?.firstName && formik.touched.author?.firstName ? (
                    <div style={{ color: 'red' }}>{formik.errors.author.firstName}</div>
                ) : null}

                <TextField
                    id="author.lastName"
                    label="Author Last Name"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.author.lastName}
                />
                {formik.errors.author?.lastName && formik.touched.author?.lastName ? (
                    <div style={{ color: 'red' }}>{formik.errors.author.lastName}</div>
                ) : null}
            </Box>

            <Button sx={{ marginTop: '15px' }} variant="contained" color="success" type="submit">
                {initialValues ? 'Update Post' : 'Create Post'}
            </Button>
        </form>
    );
};

export default PostForm;
