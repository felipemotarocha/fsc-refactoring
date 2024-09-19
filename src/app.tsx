import { BookingService } from "./layers/application/main";
import { BookingDatabaseDAO } from "./layers/resources/booking-dao";

const bookingService = new BookingService(new BookingDatabaseDAO())

const App = () => {
    const params = useParams()
    const {} = useQuery({
        queryFn: () => await bookingService.create(params)
    })
    return (  );
}
 
export default App;