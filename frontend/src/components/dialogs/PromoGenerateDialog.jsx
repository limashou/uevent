import * as React from "react";
import {useState} from "react";
import Requests from "../../api/Requests";
import {customAlert} from "../../Utils/Utils";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {Stack} from "@mui/material";
import CustomSelector from "../inputs/CustomSelector";
import CustomInputField from "../inputs/CustomInputField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

function PromoGenerateDialog({event_id}) {
    const [open, setOpen] = React.useState(false);

    const types = [
        {value: 'percentage', label: 'Percentage'},
        {value: 'fixed_amount', label: 'Fixed amount'},
    ];
    const [promo_type, setPromo_type] = useState(types[0].value);
    const [discountValue, setDiscountValue] = useState(10);

    const [validTo, setValidTo] = useState(undefined);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = () => {
        Requests.generatePromo(event_id, discountValue, promo_type, validTo).then((resp) => {
            if (resp.state === true){
                customAlert('Promo code successfully created', 'success');
            }
            else
                customAlert(resp?.message || 'Error', 'error');
        });
        handleClose();
    }

    return (
        <>
            <MenuItem key={'promogen'} onClick={handleClickOpen}>
                Generate promo code
            </MenuItem>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                }}
            >
                <DialogTitle>Promo Creation</DialogTitle>
                <DialogContent sx={{minWidth: 500}}>
                    <DialogContentText>
                        Please select details:
                    </DialogContentText>
                    <Stack gap={1} mt={1}>
                        <CustomSelector
                            label="Promo type"
                            onChange={(value) => setPromo_type(value)}
                            options={types}
                            defaultValue={types[0].value}
                        />
                        <CustomInputField
                            defaultValue={10}
                            onChangeChecked={(key, value) => {setDiscountValue(value)}}
                            label="Price"
                            type="number"
                        />
                        <CustomInputField
                            onChangeChecked={(key, value) => setValidTo(new Date(value).toISOString())}
                            id="expiresDate"
                            label="Expires date"
                            type="datetime-local"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default PromoGenerateDialog;
