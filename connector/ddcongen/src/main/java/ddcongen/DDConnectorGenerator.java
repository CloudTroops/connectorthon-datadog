package ddcongen;

import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class DDConnectorGenerator {

	public static void main(String[] args) throws IOException {
		Document doc = Jsoup.connect(args[0]).userAgent("Mozilla/5.0 (Windows; U; WindowsNT 5.1; en-US; rv1.8.1.6) Gecko/20070725 Firefox/2.0.0.6")
			      .referrer("http://www.google.com")
			      .get();
		ArrayList<String> actionList = new ArrayList<String>();
		Elements links = doc.select("div.tab-paneactive");
		for (Element currEle : links) {
			String[] actionDetails = getAction(currEle.id());
			String apiName = actionDetails[0].replaceAll("_", " ");
			apiName = apiName.substring(0, 1).toUpperCase() + apiName.substring(1);
			String method = currEle.selectFirst("p.mb-0").getAllElements().get(1).text();
			String apiDomain = currEle.selectFirst("p.mb-0").getAllElements().get(2).text().replaceAll("https://", "")
					.split("\\.")[0];
			String apiPath = currEle.selectFirst("p.mb-0").getAllElements().get(2).text().replaceAll("https://", "")
					.split("/", 2)[1];
			apiPath = apiPath.replaceAll("\\{", "\\{input.");
			
			Elements paramTypes = currEle.getElementsByClass("text-capitalize");
			ArrayList<String> params = new ArrayList<String>();
			int paramCnt = 0;
			boolean hasBody = false;
			for(Element typeTxt : paramTypes) {
				if(!typeTxt.text().replace("(", "").replace(")", "").equalsIgnoreCase("required")) {
					paramCnt++;
					params.add(typeTxt.text());
					if(typeTxt.text().startsWith("Body")) {
						hasBody=true;
					}
				}
			}
			InputSchemaObj iso = new DDConnectorGenerator().new InputSchemaObj();
			iso = generateInputSchema(currEle, params, paramCnt, method, iso);
			if(iso.inputSchema != null && (iso.inputSchema.contains("Unidentified Object:"))) {
				System.out.println("API: "+apiName+" Cannot be generated" + iso.getInputSchema());
				continue;
			}
			
			String successStatus = "";
			String sampleReqBody = "";
			Elements responseDetails = currEle.getElementsByClass("response-toggle");
			if(hasBody) {
				successStatus = responseDetails.get(1).getAllElements().get(1).text();
				sampleReqBody = currEle.getElementsByClass("language-json").get(0).text();
			}
			else {
				successStatus = responseDetails.get(0).getAllElements().get(1).text();
			}
			actionList.add("/"+actionDetails[1]+"/"+actionDetails[0]);
			apiPath = "/"+apiPath;
			if(sampleReqBody == null || sampleReqBody.equals("")) {
				sampleReqBody = "{}";
			}
			String jsFile = ActionTemplate.template.replaceAll("\\$\\{DDConGen_MOCKNAME\\}", apiName)
					.replaceAll("\\$\\{DDConGen_MOCKVERSION\\}", actionDetails[1])
					.replaceAll("\\$\\{DDConGen_MOCKINPUT\\}", sampleReqBody)
					.replaceAll("\\$\\{DDConGen_INPUTSCHEMA\\}", iso.inputSchema)
					.replaceAll("\\$\\{DDConGen_APIPATH\\}", apiPath)
					.replaceAll("\\$\\{DDConGen_SUCCESSCODE\\}", successStatus)
					.replaceAll("\\$\\{DDConGen_APIDOMAIN\\}", apiDomain)
					.replaceAll("\\$\\{DDConGen_METHOD\\}", method);
			if(iso.getQs() != null) {
				jsFile = jsFile.replaceAll("\\$\\{DDConGen_APIQS\\}", iso.getQs());
			}
			else {
				jsFile = jsFile.replaceAll("\\$\\{DDConGen_APIQS\\}", " ");
			}
			if(hasBody) {
				jsFile = jsFile.replaceAll("\\$\\{DDConGen_BODY\\}","\"json\": input.payload,");
			}
			else {
				jsFile = jsFile.replaceAll("\\$\\{DDConGen_BODY\\}","");
			}
			FileWriter myWriter = new FileWriter(args[1]+actionDetails[1]+"\\"+actionDetails[0]+".js");
			myWriter.write(jsFile);
			myWriter.close();
		}
		
		for(String action: actionList) {
			System.out.println("\""+action+"\",");
		}
	}
	
	private static InputSchemaObj generateInputSchema(Element currEle, ArrayList<String> params, int paramCnt, String method, InputSchemaObj iso) {
		StringBuffer sb = new StringBuffer();
		if(paramCnt>0) {
			sb.append("{ title: \"Input\", type: \"object\","
					+ "properties: {");
		}
		else {
			sb.append("{},");
		}
		String qs = "";
		for(int k =0; k<paramCnt;k++) {
			if(params.get(k).equals("") || params.get(k) == null) {
				continue;
			}
			else if(params.get(k).startsWith("Body")) {
				String res = createSchemaObjectWrap(currEle.selectFirst("div.table-request").children(),"payload");
				if(res.contains("Unidentified Object:")) {
					iso.setInputSchema(res);
					return iso;
				}
				sb.append(res);
			}
			else {
				Elements fName = currEle.getElementsByClass("schema-table").get(k).getElementsByClass("col-4");
				Elements fType = currEle.getElementsByClass("schema-table").get(k).getElementsByClass("col-2");
				for(int j = 1; j<fName.size();j++) {
					sb.append(createSchemaObject(fName.get(j).text(), fType.get(j).text(), currEle));
					if(params.get(k).contains("Query")) {
						if(fName.get(j).text().replaceAll(" \\[required\\]","").indexOf("[")>-1) {
							qs = qs+"\""+fName.get(j).text().replaceAll(" \\[required\\]","")+"\": input."
							+fName.get(j).text().replaceAll(" \\[required\\]","").replaceAll("\\[", "_").replaceAll("\\]", "")+",";
						}
						else {
							qs = qs+fName.get(j).text()+": input."
									+fName.get(j).text()+",";
						}
					}
				}
			}
		}
		if(paramCnt>0) {
			sb.append("} },");
		}
		if(!qs.equals("")) {
			iso.setQs(qs.substring(0, qs.length()-1));
		}
		iso.setInputSchema(sb.toString());
		return iso;
	}
	
	private static String createSchemaObjectWrap(Elements curEle, String elementName) {
		String objStr = "\""+elementName+"\": { \"title\":\""+elementName+"\","
				+ "\"type\": \"object\", \"properties\": {";
		for(Element curNode: curEle.get(1).children().get(1).children()) {
			if(curNode.hasClass("isReadOnly")) {
				continue;
			}
			else {
				if(curNode.hasClass("hasChildData")) {
					String res = createNestedObject(curNode.getAllElements());
					if(res.contains("Unidentified Object:")) {
						return res;
					}
					objStr = objStr+res;
					if(curNode.getElementsByClass("col-2").text().contains("[object]")) {
						objStr = objStr+"},";
					}
					continue;
				}
				objStr = objStr + createSchemaObject(curNode.getElementsByClass("col-4").text(), curNode.getElementsByClass("col-2").text(), curNode);
				
			}
		}
		return objStr +"} },";
	}
	
	private static String createNestedObject(Elements curEle) {
		String objStr = "";
		boolean rootEleMark = false;
		for(Element curNode: curEle.get(1).children()) {
			if(curNode.hasClass("isReadOnly")) {
				continue;
			}
			if(curNode.getElementsByClass("col-2").text().contains("oneOf")) {
				return "Unidentified Object: oneOf";
			}
			if(!rootEleMark) {
				if(curNode.getElementsByClass("col-2").text().contains("[object]")) {
					objStr = "\""+curNode.getElementsByClass("col-4").text().replaceAll(" \\[required\\]", "")+"\": { \"title\":\""+curNode.getElementsByClass("col-4").text()
							.replaceAll(" \\[required\\]", "")+"\","
							+ "\"type\": \"array\", \"items\" : { \"type\": \"object\", \"properties\": {";
					rootEleMark = true;
				}
				else {
					objStr = "\""+curNode.getElementsByClass("col-4").text().replaceAll(" \\[required\\]", "")+"\": { \"title\":\""+curNode.getElementsByClass("col-4")
					.text().replaceAll(" \\[required\\]", "")+"\","
							+ "\"type\": \"object\", \"properties\": {";
					rootEleMark = true;
				}
				continue;
			}
			else {
				if(curNode.hasClass("hasChildData")) {
					String res = createNestedObject(curNode.getAllElements());
					if(res.contains("Unidentified Object:")) {
						return res;
					}
					objStr = objStr+res;
					if(curNode.getElementsByClass("col-2").text().contains("[object]")) {
						objStr = objStr+"}, },";
					}
					continue;
				}
				objStr = objStr + createSchemaObject(curNode.getElementsByClass("col-4").text(), curNode.getElementsByClass("col-2").text(),curNode);
				
			}
		}
		return objStr +"} },";
	}
	
	private static String createSchemaObject(String fieldName, String fieldType, Element curEle) {
		
		String objString = "";
		boolean required = false;
		if(fieldName.endsWith(" [required]")) {
			fieldName = fieldName.replaceAll(" \\[required\\]", "");
			required = true;
		}
		else {
			fieldName= fieldName.replaceAll("\\[", "_").replaceAll("\\]", "");
		}
		
		objString = "\""+fieldName+"\": { \"title\":"+ "\""+fieldName+"\",";
		if(fieldType.equalsIgnoreCase("string")) {
			objString=objString+"\"type\": \"string\",";
			if(required) {
				objString=objString+"\"minLength\" : 1";
			}
			objString = objString +"},";
		}
		else if(fieldType.equalsIgnoreCase("boolean")) {
			objString=objString+"\"type\": \"boolean\",";
			if(required) {
				objString=objString+"\"minLength\" : 1";
			}
			objString = objString +"},";
		}else if(fieldType.startsWith("int")) {
			objString=objString+"\"type\": \"integer\",";
			if(required) {
				objString=objString+"\"minLength\" : 1";
			}
			objString = objString +"},";
		}
		else if(fieldType.startsWith("double")) {
			objString=objString+"\"type\": \"number\",";
			if(required) {
				objString=objString+"\"minLength\" : 1";
			}
			objString = objString +"},";
		}
		else if(fieldType.equals("[string]")) {
			 objString = objString
			 		+ "\"type\": \"array\","
			 		+ "\"items\" : {"
			 		+ "    \"type\": \"string\","
			 		+ "    \"title\" : \""+fieldName+"\",";          
			 if(required) {
				 objString = objString
					 		+ "\"minLength\" : 1  }"
					 		+ "} },";
			 }
			 else {
				 objString = objString + "} },";
			 }
		}
		else if(fieldType.equalsIgnoreCase("date-time")) {
			objString=objString+"\"type\": \"date-time\",";
			if(required) {
				objString=objString+"\"minLength\" : 1";
			}
			objString = objString +"},";
		}
		else if (fieldType.equals("enum")) {
			objString=objString+"\"type\": \"string\",";
			Elements codes = curEle.getElementsByClass("col-6 column").get(0).getElementsByTag("code");
			for(Element code : codes) {
				if(code.text().contains(",")) {
					objString = objString + "\"enum\": [\""+code.text().replaceAll(",", "\",\"")+"\"],";
				}
			}
			if(required) {
				objString=objString+"\"minLength\" : 1";
			}
			objString = objString +"},";
		}
		else {
			System.out.println("-----------------Warning: Unknown ObjectType "+fieldType +" for field "+fieldName);
		}
		
		return objString;
	}

	private static String[] getAction(String actionId) {
		actionId = actionId.replaceAll("-", "_");
		String[] actionDetails = { actionId.substring(0, actionId.lastIndexOf("_")),
				actionId.substring(actionId.lastIndexOf("_") + 1) };
		return actionDetails;
	}
	
	private class InputSchemaObj {
		String inputSchema;
		String qs;
		public String getInputSchema() {
			return inputSchema;
		}
		public void setInputSchema(String inputSchema) {
			this.inputSchema = inputSchema;
		}
		public String getQs() {
			return qs;
		}
		public void setQs(String qs) {
			this.qs = qs;
		}
	}

}
