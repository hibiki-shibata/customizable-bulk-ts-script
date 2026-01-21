const i = 1

export type configType = {
    request_method: string,
    request_uri: string,
    security_header_name: string,
    base_csv_column_name: string,

    optional_csv_column_name_1?: string,
    optional_csv_column_name_2?: string,
    optional_csv_column_name_3?: string,
    optional_csv_column_name_4?: string,
    optional_csv_column_name_5?: string,
    optional_csv_column_name_6?: string,
    optional_csv_column_name_7?: string,
    optional_csv_column_name_8?: string,
    optional_csv_column_name_9?: string,
    optional_csv_column_name_10?: string,

    csv_file_path: string,
    json_file_path: string,
    use_request_body: boolean,
    async_process: boolean,
    getVenueIDFromName?: boolean
}

