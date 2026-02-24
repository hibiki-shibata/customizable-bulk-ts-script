import { configType } from "../src/type/config.Type.js"; export const config: configType = {
  // =====================================================================================================================================

  //                       Feel free to contact HIBIKI for question !

  // ============================📝 FILL YOUR CONFIGURATION BELOW 📝==================================================================================

  // A) Change to true if you want to get venue ID list from venue names in the CSV file.
  showVenueID: false,
  showCpPaymentBalance: false,

  // B) Access Token's header name.
  security_header_name: "Authorization",

  // C) Request Method.
  // request_method: "PUT",
  request_method: "GET",
  // request_method: "PATCH",
  // request_method: "POST",
  // request_method: "DELETE",

  // D) Request URI.
  //        Optionally, use [Your Column Name] as a placeholder for replacing it with cell data in the CSV column.
  request_uri: "https://example/path/[venueID]/[venueName]/emails/[emailAddress]/contact",


  // F) Resource File names (placed in the /resource folder).

  // F'1) JSON file name. The content represent request body.
  json_file_name: "request-body-template.json",

  // F'2) CSV file name.
  csv_file_name: "custom-values.csv", // Define your custom data.

  // ============================📝 FILL YOUR CONFIGURATION ABOVE 📝==================================================================================

  //                      Feel free to contact HIBIKI for question !

  // =====================================================================================================================================
}
