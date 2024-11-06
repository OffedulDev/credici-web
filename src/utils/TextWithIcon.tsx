import {Typography} from "@mui/material";

interface TextWithIconProps {
    icon: any,
    text: string
}

function TextWithIcon({ icon, text }: TextWithIconProps) {
    return <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "0.25rem"
    }}>
        {icon}
        <Typography fontSize="1.25rem">
            {text}
        </Typography>
    </div>;
}

export default TextWithIcon